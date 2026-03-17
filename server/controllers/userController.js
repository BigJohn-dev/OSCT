const User = require('../models/User');
const Contribution = require('../models/Contribution');

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 20, search, skill } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { isActive: true };
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { githubUsername: { $regex: search, $options: 'i' } }
  ];
  if (skill) filter.skills = { $in: [skill] };

  const [users, total] = await Promise.all([
    User.find(filter).select('-githubToken').sort({ totalPoints: -1 }).skip(skip).limit(parseInt(limit)),
    User.countDocuments(filter)
  ]);

  res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-githubToken');
  if (!user || !user.isActive) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
};

exports.createUser = async (req, res) => {
  const { name, email, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const user = await User.create({ name, email, role: role || 'user' });
  res.status(201).json({ user });
};

exports.updateUser = async (req, res) => {
  // Only allow users to update their own profile, admins can update anyone
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to update this profile' });
  }

  const allowed = ['name', 'bio', 'location', 'website', 'skills', 'socialLinks', 'avatar'];
  if (req.user.role === 'admin') allowed.push('role', 'isActive');

  const updates = {};
  allowed.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-githubToken');
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ user });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deactivated successfully' });
};

exports.getUserContributions = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = { user: req.params.id };
  if (status) filter.status = status;

  const [contributions, total] = await Promise.all([
    Contribution.find(filter).populate('project', 'name githubUrl logo').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Contribution.countDocuments(filter)
  ]);

  res.json({ contributions, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
};
