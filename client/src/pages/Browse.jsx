import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { Card, Empty, Spinner, Err, TYPES, AMENITIES } from '../components';
export default function Browse() {
  const [sp] = useSearchParams();
  const [f, setF] = useState({ q: sp.get('q') || '', city: sp.get('city') || '', minRent: '', maxRent: sp.get('maxRent') || '', type: sp.get('type') || '', amenities: sp.get('amenities') || '', sort: 'newest' });
  const [items, setItems] = useState(null), [cities, setCities] = useState([]), [err, setErr] = useState('');
  useEffect(() => { api('/listings/cities').then(setCities).catch(() => {}); }, []);
  useEffect(() => { setErr(''); setItems(null); const t = setTimeout(() => api('/listings?' + new URLSearchParams(Object.entries(f).filter(([, v]) => v))).then(setItems).catch(e => { setErr(e.message); setItems([]); }), 250); return () => clearTimeout(t); }, [f]);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const toggle = a => { const cur = f.amenities.split(',').filter(Boolean); setF({ ...f, amenities: (cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a]).join(',') }); };
  return (<section><h2>Browse accommodation</h2>
    <div className="filters">
      <input placeholder="Search title or address" value={f.q} onChange={set('q')} aria-label="Search" />
      <select value={f.city} onChange={set('city')} aria-label="City"><option value="">All cities</option>{cities.map(c => <option key={c}>{c}</option>)}</select>
      <select value={f.type} onChange={set('type')} aria-label="Type"><option value="">All types</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
      <input type="number" min="0" placeholder="Min ₹" value={f.minRent} onChange={set('minRent')} aria-label="Min rent" />
      <input type="number" min="0" placeholder="Max ₹" value={f.maxRent} onChange={set('maxRent')} aria-label="Max rent" />
      <select value={f.sort} onChange={set('sort')} aria-label="Sort"><option value="newest">Newest</option><option value="rent_asc">Rent: low to high</option><option value="rent_desc">Rent: high to low</option></select>
      <button className="btn ghost" onClick={() => setF({ q: '', city: '', minRent: '', maxRent: '', type: '', amenities: '', sort: 'newest' })}>Clear filters</button></div>
    <div className="chips">{AMENITIES.map(a => <button key={a} className={'chip' + (f.amenities.split(',').includes(a) ? ' on' : '')} onClick={() => toggle(a)}>{a}</button>)}</div>
    <Err msg={err} />
    {!items ? <Spinner /> : items.length ? <div className="grid">{items.map(l => <Card key={l._id} l={l} />)}</div> : !err && <Empty title="No listings match">Try a higher budget or fewer filters.</Empty>}</section>);
}
