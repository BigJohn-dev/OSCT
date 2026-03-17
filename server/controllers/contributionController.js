const Contribution = require('../models/Contribution');
const Project = require('../models/Project');
const User = require('../models/User');
const POINTS_CONFIG = require('../config/points');

exports.getContributions = async (req, res) => {
  const { page = 1, limit = 20, user, project, type, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (user) filter.user = user;
  if (project) filter.project = project;
  if (type) filter.type = type;
  if (status) filter.status = status;

  const [contributions, total] = await Promise.all([
    Contribution.find(filter)
      .populate('user', 'name avatar githubUsername')
      .populate('project', 'name githubUrl logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Contribution.countDocuments(filter)
  ]);

  res.json({ contributions, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
};

exports.getContributionById = async (req, res) => {
  const contribution = await Contribution.findById(req.params.id)
    .populate('user', 'name avatar githubUsername')
    .populate('project', 'name githubUrl logo')
    .populate('reviewedBy', 'name');

  if (!contribution) return res.status(404).json({ error: 'Contribution not found' });
  res.json({ contribution });
};

exports.createContribution = async (req, res) => {
  const { project, type, title, description, githubPrUrl, githubIssueUrl } = req.body;

  // Verify project exists
  const projectDoc = await Project.findById(project);
  if (!projectDoc || !projectDoc.isActive) return res.status(404).json({ error: 'Project not found' });

  // Calculate points from config
  const typeConfig = POINTS_CONFIG.contribution_types[type];
  const points = typeConfig ? typeConfig.points : 5;

  const contribution = await Contribution.create({
    user: req.user._id,
    project,
    type,
    title,
    description,
    githubPrUrl,
    githubIssueUrl,
    points,
    status: 'pending',
    isManual: true
  });

  await contribution.populate(['user', 'project']);
  res.status(201).json({ contribution });
};

exports.updateContribution = async (req, res) => {
  const contribution = await Contribution.findById(req.params.id);
  if (!contribution) return res.status(404).json({ error: 'Contribution not found' });

  // Only owner can edit, and only if pending
  if (contribution.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  if (contribution.status !== 'pending' && req.user.role !== 'admin') {
    return res.status(400).json({ error: 'Can only edit pending contributions' });
  }

  const allowed = ['title', 'description', 'githubPrUrl', 'githubIssueUrl', 'type'];
  allowed.forEach(f => { if (req.body[f] !== undefined) contribution[f] = req.body[f]; });

  // Recalculate points if type changed
  if (req.body.type) {
    const typeConfig = POINTS_CONFIG.contribution_types[req.body.type];
    contribution.points = typeConfig ? typeConfig.points : contribution.points;
  }

  await contribution.save();
  res.json({ contribution });
};

exports.deleteContribution = async (req, res) => {
  const contribution = await Contribution.findById(req.params.id);
  if (!contribution) return res.status(404).json({ error: 'Contribution not found' });

  if (contribution.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // If it was approved, deduct points from user
  if (contribution.status === 'approved') {
    await User.findByIdAndUpdate(contribution.user, { $inc: { totalPoints: -contribution.points } });
    await Project.findByIdAndUpdate(contribution.project, { $inc: { contributionCount: -1 } });
  }

  await contribution.deleteOne();
  res.json({ message: 'Contribution deleted' });
};

exports.reviewContribution = async (req, res) => {
  const { status, reviewNote } = req.body;
  const contribution = await Contribution.findById(req.params.id).populate('user');

  if (!contribution) return res.status(404).json({ error: 'Contribution not found' });
  if (contribution.status !== 'pending') return res.status(400).json({ error: 'Contribution already reviewed' });

  contribution.status = status;
  contribution.reviewedBy = req.user._id;
  contribution.reviewedAt = new Date();
  contribution.reviewNote = reviewNote || '';
  await contribution.save();

  if (status === 'approved') {
    // Award points to user
    const user = await User.findById(contribution.user._id);
    user.totalPoints += contribution.points;
    user.checkAndAssignBadges();
    await user.save();

    // Increment project contribution count
    await Project.findByIdAndUpdate(contribution.project, { $inc: { contributionCount: 1 } });
  }

  await contribution.populate(['user', 'project', 'reviewedBy']);
  res.json({ contribution, message: `Contribution ${status}` });
};
