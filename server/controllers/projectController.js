const axios = require('axios');
const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  const { page = 1, limit = 12, search, difficulty, category, language } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { isActive: true };
  if (search) filter.$text = { $search: search };
  if (difficulty) filter.difficulty = difficulty;
  if (category) filter.category = category;
  if (language) filter.language = { $regex: language, $options: 'i' };

  const sortBy = search ? { score: { $meta: 'textScore' } } : { isFeatured: -1, stars: -1 };

  const [projects, total] = await Promise.all([
    Project.find(filter).sort(sortBy).skip(skip).limit(parseInt(limit)).populate('maintainer', 'name avatar githubUsername'),
    Project.countDocuments(filter)
  ]);

  res.json({ projects, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
};

exports.getFeaturedProjects = async (req, res) => {
  const projects = await Project.find({ isActive: true, isFeatured: true })
    .sort({ stars: -1 })
    .limit(6)
    .populate('maintainer', 'name avatar');
  res.json({ projects });
};

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('maintainer', 'name avatar githubUsername');
  if (!project || !project.isActive) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
};

exports.createProject = async (req, res) => {
  const project = await Project.create({ ...req.body, maintainer: req.user._id });
  res.status(201).json({ project });
};

exports.updateProject = async (req, res) => {
  const allowed = ['name', 'description', 'websiteUrl', 'language', 'topics', 'difficulty', 'category', 'logo', 'isActive', 'isFeatured', 'stars', 'forks', 'openIssues'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
};

exports.deleteProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ message: 'Project deleted successfully' });
};

exports.syncFromGithub = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  try {
    // Extract owner/repo from GitHub URL
    const match = project.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return res.status(400).json({ error: 'Invalid GitHub URL' });

    const [, owner, repo] = match;
    const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    });

    project.stars = data.stargazers_count;
    project.forks = data.forks_count;
    project.openIssues = data.open_issues_count;
    project.language = data.language || project.language;
    project.topics = data.topics || project.topics;
    project.description = data.description || project.description;
    project.lastGithubSync = new Date();

    await project.save();
    res.json({ project, message: 'Synced from GitHub successfully' });
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch data from GitHub', details: err.message });
  }
};
