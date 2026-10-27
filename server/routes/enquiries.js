const r = require('express').Router(), { Enquiry, Listing } = require('../models'), { h, fail, auth } = require('../middleware/auth');
r.use(auth);
r.post('/', h(async (q, s) => {
  const msg = String(q.body.message || '').trim();
  if (msg.length < 5 || msg.length > 1000) throw fail(400, 'Message must be between 5 and 1000 characters');
  const l = await Listing.findById(String(q.body.listing)); if (!l) throw fail(404, 'Listing not found');
  if (l.owner.equals(q.user._id)) throw fail(400, 'You cannot send an enquiry on your own listing');
  s.status(201).json(await Enquiry.create({ listing: l._id, from: q.user._id, to: l.owner, message: msg }));
}));
r.get('/mine', h(async (q, s) => {
  const incoming = await Enquiry.find({ to: q.user._id }).sort('-createdAt').populate('listing', 'title').populate('from', 'name email');
  const out = await Enquiry.find({ from: q.user._id }).sort('-createdAt').populate('listing', 'title').populate('to', 'name email');
  s.json({ incoming, outgoing: out.map(e => { const o = e.toObject(); if (e.status !== 'accepted') delete o.to.email; return o; }) });
}));
r.patch('/:id', h(async (q, s) => {
  if (!['accepted', 'declined'].includes(q.body.status)) throw fail(400, 'Status must be accepted or declined');
  const e = await Enquiry.findById(q.params.id); if (!e) throw fail(404, 'Enquiry not found');
  if (!e.to.equals(q.user._id)) throw fail(403, 'Only the listing owner can respond');
  e.status = q.body.status; s.json(await e.save());
}));
module.exports = r;
