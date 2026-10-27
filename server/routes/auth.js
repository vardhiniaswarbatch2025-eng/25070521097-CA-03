const r = require('express').Router(), bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken');
const { User } = require('../models'), { h, fail, auth } = require('../middleware/auth');
const out = u => ({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }), user: { id: u._id, name: u.name, email: u.email, college: u.college } });
r.post('/register', h(async (q, s) => {
  const name = String(q.body.name || '').trim(), email = String(q.body.email || '').trim().toLowerCase(), pw = String(q.body.password || ''), college = String(q.body.college || '').trim();
  const e = [];
  if (name.length < 2) e.push('Name must be at least 2 characters');
  if (!/^\S+@\S+\.\S+$/.test(email)) e.push('Enter a valid email address');
  if (pw.length < 6) e.push('Password must be at least 6 characters');
  if (e.length) throw fail(400, e.join('. '));
  if (await User.findOne({ email })) throw fail(409, 'An account with this email already exists');
  s.status(201).json(out(await User.create({ name, email, college, password: await bcrypt.hash(pw, 10) })));
}));
r.post('/login', h(async (q, s) => {
  const u = await User.findOne({ email: String(q.body.email || '').trim().toLowerCase() });
  if (!u || !(await bcrypt.compare(String(q.body.password || ''), u.password))) throw fail(401, 'Incorrect email or password');
  s.json(out(u));
}));
r.get('/me', auth, (q, s) => s.json(q.user));
module.exports = r;
