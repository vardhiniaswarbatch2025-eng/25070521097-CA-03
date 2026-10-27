import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useApp } from '../ctx';
import { Err, Spinner, TYPES, AMENITIES } from '../components';
const blank = { title: '', city: '', address: '', rent: '', roomType: TYPES[0], description: '', amenities: [], imageUrl: '', available: true };
export default function Form() {
  const { id } = useParams(), nav = useNavigate(), { user, notify } = useApp(), [f, setF] = useState(blank), [errs, setErrs] = useState([]), [busy, setBusy] = useState(false), [ready, setReady] = useState(!id);
  useEffect(() => { if (id) api('/listings/' + id).then(l => { if (l.owner._id !== user.id) { notify('You can only edit your own listings', 'err'); return nav('/dashboard'); } setF({ ...blank, ...l }); setReady(true); }).catch(e => { notify(e.message, 'err'); nav('/dashboard'); }); }, [id]);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const validate = () => { const e = []; if (f.title.trim().length < 5) e.push('Title must be at least 5 characters'); if (!f.city.trim()) e.push('City is required'); if (!f.address.trim()) e.push('Address is required'); if (!(Number(f.rent) > 0)) e.push('Rent must be a positive number'); if (f.description.trim().length < 20) e.push('Description must be at least 20 characters'); if (f.imageUrl && !/^https?:\/\/\S+$/.test(f.imageUrl)) e.push('Image URL must start with http:// or https://'); return e; };
  const submit = async e => { e.preventDefault(); const v = validate(); setErrs(v); if (v.length) return; setBusy(true);
    try { const l = await api(id ? '/listings/' + id : '/listings', { method: id ? 'PUT' : 'POST', body: f }); notify(id ? 'Listing updated' : 'Listing published'); nav('/listings/' + l._id); } catch (x) { setErrs([x.message]); } setBusy(false); };
  if (!ready) return <Spinner />;
  return (<form className="box narrow" onSubmit={submit} noValidate><h2>{id ? 'Edit listing' : 'Add accommodation'}</h2>
    <label>Title<input value={f.title} onChange={set('title')} /></label>
    <label>City<input value={f.city} onChange={set('city')} /></label>
    <label>Address<input value={f.address} onChange={set('address')} /></label>
    <label>Monthly rent (₹)<input type="number" min="1" value={f.rent} onChange={set('rent')} /></label>
    <label>Room type<select value={f.roomType} onChange={set('roomType')}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></label>
    <label>Description<textarea rows="4" value={f.description} onChange={set('description')} /></label>
    <label>Image URL (optional)<input value={f.imageUrl} onChange={set('imageUrl')} placeholder="https://" /></label>
    <fieldset><legend>Amenities</legend>{AMENITIES.map(a => <label className="chk" key={a}><input type="checkbox" checked={f.amenities.includes(a)} onChange={() => setF({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] })} />{a}</label>)}</fieldset>
    <label className="chk"><input type="checkbox" checked={f.available} onChange={e => setF({ ...f, available: e.target.checked })} />Currently available</label>
    {errs.map(x => <Err key={x} msg={x} />)}<button className="btn" disabled={busy}>{busy ? 'Saving…' : id ? 'Save changes' : 'Publish listing'}</button></form>);
}
