import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Card, Empty, Spinner, Err, TYPES, AMENITIES } from '../components';
const steps = [['Search', 'Filter by city, budget and room type.'], ['Enquire', 'Message the owner from the listing page.'], ['Match', 'Save your habits and see compatible roommates.']];
const perks = [['Budget first', 'Sort by rent to find what you can afford.'], ['Real accounts', 'Every listing belongs to a registered student or owner.'], ['Compatible roommates', 'Matches use budget, city, cleanliness and routine.']];
const talk = [['Found a PG near campus in one evening.', 'Sample feedback'], ['Matched with a roommate who also studies quietly.', 'Sample feedback']];
export default function Home() {
  const nav = useNavigate(), [f, setF] = useState({ q: '', city: '', maxRent: '', type: '', amenities: '' }), [items, setItems] = useState(null), [err, setErr] = useState('');
  useEffect(() => { api('/listings?sort=newest&limit=3').then(setItems).catch(e => setErr(e.message)); }, []);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const go = e => { e.preventDefault(); nav('/browse?' + new URLSearchParams(Object.entries(f).filter(([, v]) => v))); };
  return (<>
    <section className="hero"><h1>Find Your Space. Find Your People.</h1><p className="muted">Affordable rooms and compatible roommates for college students.</p>
      <form className="search" onSubmit={go}>
        <input placeholder="City" value={f.city} onChange={set('city')} aria-label="City" />
        <input type="number" min="0" placeholder="Max rent (₹)" value={f.maxRent} onChange={set('maxRent')} aria-label="Max rent" />
        <select value={f.type} onChange={set('type')} aria-label="Type"><option value="">Any type</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
        <select value={f.amenities} onChange={set('amenities')} aria-label="Amenity"><option value="">Any amenity</option>{AMENITIES.map(t => <option key={t}>{t}</option>)}</select>
        <button className="btn">Search</button></form></section>
    <section><h2>Newest listings</h2><Err msg={err} />{!items && !err ? <Spinner /> : items?.length ? <div className="grid">{items.map(l => <Card key={l._id} l={l} />)}</div> : !err && <Empty title="No listings yet">Create an account and add the first one.</Empty>}</section>
    <section><h2>How it works</h2><div className="grid">{steps.map(([t, d], i) => <div className="box" key={t}><b>{i + 1}. {t}</b><p className="muted">{d}</p></div>)}</div></section>
    <section><h2>Why students use it</h2><div className="grid">{perks.map(([t, d]) => <div className="box" key={t}><b>{t}</b><p className="muted">{d}</p></div>)}</div></section>
    <section><h2>What students say</h2><div className="grid">{talk.map(([t, s]) => <div className="box" key={t}><p>“{t}”</p><span className="muted">{s}</span></div>)}</div></section>
  </>);
}
