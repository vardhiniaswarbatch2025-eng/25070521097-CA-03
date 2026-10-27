const r = require('express').Router(), { Listing, Enquiry } = require('../models'), { h, fail, auth } = require('../middleware/auth');
const TYPES = ['Single room', 'Shared room', 'PG', 'Hostel', 'Flat'];
const esc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const check = b => { const e = [], t = k => String(b[k] ?? '').trim();
  if (t('title').length < 5) e.push('Title must be at least 5 characters');
  if (!t('city')) e.push('City is required');
  if (!t('address')) e.push('Address is required');
  if (!(Number(b.rent) > 0)) e.push('Rent must be a positive number');
  if (!TYPES.includes(b.roomType)) e.push('Choose a valid room type');
  if (t('description').length < 20) e.push('Description must be at least 20 characters');
  if (t('imageUrl') && !/^https?:\/\/\S+$/.test(t('imageUrl'))) e.push('Image URL must start with http:// or https://');
  return e; };
const pick = b => ({ title: String(b.title).trim(), city: String(b.city).trim(), address: String(b.address).trim(), rent: Number(b.rent), roomType: b.roomType, description: String(b.description).trim(), amenities: Array.isArray(b.amenities) ? b.amenities.map(String).slice(0, 20) : [], imageUrl: String(b.imageUrl || '').trim(), available: b.available !== false });
r.get('/', h(async (q, s) => {
  const { q: text, city, minRent, maxRent, type, amenities, sort, limit } = q.query, f = { available: true };
  if (city) f.city = new RegExp('^' + esc(city) + '$', 'i');
  if (text) f.$or = ['title', 'address', 'city'].map(k => ({ [k]: new RegExp(esc(text), 'i') }));
  if (type) f.roomType = String(type);
  if (minRent || maxRent) f.rent = { ...(minRent && { $gte: Number(minRent) }), ...(maxRent && { $lte: Number(maxRent) }) };
  if (amenities) f.amenities = { $all: String(amenities).split(',').filter(Boolean) };
  const order = { rent_asc: { rent: 1 }, rent_desc: { rent: -1 } }[sort] || { createdAt: -1 };
  s.json(await Listing.find(f).sort(order).limit(Math.min(Number(limit) || 60, 60)));
}));
r.get('/cities', h(async (q, s) => s.json(await Listing.distinct('city', { available: true }))));
r.get('/mine', auth, h(async (q, s) => s.json(await Listing.find({ owner: q.user._id }).sort('-createdAt'))));
r.get('/:id', h(async (q, s) => { const l = await Listing.findById(q.params.id).populate('owner', 'name college'); if (!l) throw fail(404, 'Listing not found'); s.json(l); }));
r.post('/', auth, h(async (q, s) => { const e = check(q.body); if (e.length) throw fail(400, e.join('. ')); s.status(201).json(await Listing.create({ ...pick(q.body), owner: q.user._id })); }));
r.put('/:id', auth, h(async (q, s) => {
  const l = await Listing.findById(q.params.id); if (!l) throw fail(404, 'Listing not found');
  if (!l.owner.equals(q.user._id)) throw fail(403, 'You can only edit your own listings');
  const e = check(q.body); if (e.length) throw fail(400, e.join('. '));
  Object.assign(l, pick(q.body)); s.json(await l.save());
}));
r.delete('/:id', auth, h(async (q, s) => {
  const l = await Listing.findById(q.params.id); if (!l) throw fail(404, 'Listing not found');
  if (!l.owner.equals(q.user._id)) throw fail(403, 'You can only delete your own listings');
  await Enquiry.deleteMany({ listing: l._id }); await l.deleteOne(); s.json({ ok: true });
}));
module.exports = r;
