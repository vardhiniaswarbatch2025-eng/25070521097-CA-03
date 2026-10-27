const jwt = require('jsonwebtoken'), { User } = require('../models');
exports.h = f => (req, res, next) => f(req, res, next).catch(next);
exports.fail = (status, message) => Object.assign(new Error(message), { status });
exports.auth = exports.h(async (req, res, next) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { const { id } = jwt.verify(t, process.env.JWT_SECRET); req.user = await User.findById(id).select('-password'); } catch { req.user = null; }
  if (!req.user) throw exports.fail(401, 'Please log in to continue');
  next();
});
