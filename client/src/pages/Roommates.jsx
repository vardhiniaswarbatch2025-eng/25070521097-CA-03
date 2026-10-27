import { useEffect, useState } from 'react';
import { api } from '../api';
import { useApp } from '../ctx';
import { Empty, Err } from '../components';
export default function Roommates() {
  const { notify } = useApp(), [f, setF] = useState({ budget: '', cleanliness: 3, lifestyle: 'Balanced', studyHabit: 'Flexible', city: '', bio: '' }), [m, setM] = useState(null), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const matches = () => api('/roommates/matches').then(setM).catch(e => { setM(null); if (!/preferences first/.test(e.message)) setErr(e.message); });
  useEffect(() => { api('/roommates/preferences').then(p => { if (p) { setF({ ...p, bio: p.bio || '' }); matches(); } }).catch(e => setErr(e.message)); }, []);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const save = async e => { e.preventDefault(); setErr(''); setBusy(true); try { await api('/roommates/preferences', { method: 'PUT', body: f }); notify('Preferences saved'); await matches(); } catch (x) { setErr(x.message); } setBusy(false); };
  return (<section><h2>Roommate matching</h2><div className="two">
    <form className="box" onSubmit={save}>
      <label>Monthly budget (₹)<input type="number" min="1" value={f.budget} onChange={set('budget')} required /></label>
      <label>Preferred city<input value={f.city} onChange={set('city')} required /></label>
      <label>Cleanliness (1 relaxed, 5 very tidy)<input type="range" min="1" max="5" value={f.cleanliness} onChange={set('cleanliness')} /> {f.cleanliness}</label>
      <label>Lifestyle<select value={f.lifestyle} onChange={set('lifestyle')}><option>Early bird</option><option>Night owl</option><option>Balanced</option></select></label>
      <label>Study habit<select value={f.studyHabit} onChange={set('studyHabit')}><option>Quiet</option><option>Group study</option><option>Flexible</option></select></label>
      <label>About you (optional)<textarea rows="3" maxLength="300" value={f.bio} onChange={set('bio')} /></label>
      <Err msg={err} /><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save and find matches'}</button></form>
    <div>{m === null ? <Empty title="No matches yet">Save your preferences to see compatible students.</Empty> : m.length ? m.map((x, i) => <div className="box" key={i}><div className="row"><b>{x.name}</b><span className="rent">{x.score}% match</span></div><p className="muted">{x.college || 'College not set'}. {x.city}, up to ₹{x.budget}</p><span className="tag">{x.lifestyle}</span><span className="tag">{x.studyHabit}</span><span className="tag">Cleanliness {x.cleanliness}/5</span>{x.bio && <p>{x.bio}</p>}</div>) : <Empty title="No compatible roommates yet">More students need to save preferences.</Empty>}</div></div></section>);
}
