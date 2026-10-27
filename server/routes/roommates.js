const r = require('express').Router(), { Preference } = require('../models'), { h, fail, auth } = require('../middleware/auth');
r.use(auth);
r.get('/preferences', h(async (q, s) => s.json(await Preference.findOne({ user: q.user._id }))));
r.put('/preferences', h(async (q, s) => {
  const b = q.body, e = [];
  if (!(Number(b.budget) > 0)) e.push('Budget must be a positive number');
  if (!(Number(b.cleanliness) >= 1 && Number(b.cleanliness) <= 5)) e.push('Cleanliness must be 1 to 5');
  if (!['Early bird', 'Night owl', 'Balanced'].includes(b.lifestyle)) e.push('Choose a lifestyle');
  if (!['Quiet', 'Group study', 'Flexible'].includes(b.studyHabit)) e.push('Choose a study habit');
  if (!String(b.city || '').trim()) e.push('Preferred city is required');
  if (e.length) throw fail(400, e.join('. '));
  s.json(await Preference.findOneAndUpdate({ user: q.user._id }, { budget: Number(b.budget), cleanliness: Number(b.cleanliness), lifestyle: b.lifestyle, studyHabit: b.studyHabit, city: String(b.city).trim(), bio: String(b.bio || '').slice(0, 300) }, { upsert: true, new: true }));
}));
r.get('/matches', h(async (q, s) => {
  const me = await Preference.findOne({ user: q.user._id }); if (!me) throw fail(400, 'Save your preferences first');
  const all = await Preference.find({ user: { $ne: q.user._id } }).populate('user', 'name college');
  const res = all.map(p => { let score = 0;
    if (p.city.toLowerCase() === me.city.toLowerCase()) score += 30;
    if (Math.abs(p.budget - me.budget) <= me.budget * 0.25) score += 30;
    if (Math.abs(p.cleanliness - me.cleanliness) <= 1) score += 20;
    if (p.lifestyle === me.lifestyle) score += 10;
    if (p.studyHabit === me.studyHabit) score += 10;
    return { score, name: p.user.name, college: p.user.college, city: p.city, budget: p.budget, cleanliness: p.cleanliness, lifestyle: p.lifestyle, studyHabit: p.studyHabit, bio: p.bio }; });
  s.json(res.filter(m => m.score >= 40).sort((a, b) => b.score - a.score));
}));
module.exports = r;
