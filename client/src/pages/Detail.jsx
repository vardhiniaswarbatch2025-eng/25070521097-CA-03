import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { useApp } from '../ctx';
import { Spinner, Err } from '../components';
export default function Detail() {
  const { id } = useParams(), { user, notify } = useApp(), [l, setL] = useState(null), [err, setErr] = useState(''), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false), [ferr, setFerr] = useState('');
  useEffect(() => { api('/listings/' + id).then(setL).catch(e => setErr(e.message)); }, [id]);
  const send = async e => { e.preventDefault(); setFerr(''); setBusy(true); try { await api('/enquiries', { method: 'POST', body: { listing: id, message: msg } }); setMsg(''); notify('Enquiry sent'); } catch (x) { setFerr(x.message); } setBusy(false); };
  if (err) return <Err msg={err} />; if (!l) return <Spinner />;
  const mine = user && l.owner && user.id === l.owner._id;
  return (<section className="detail">
    {l.imageUrl && <img className="hero-img" src={l.imageUrl} alt={l.title} onError={e => { e.target.style.display = 'none'; }} />}
    <div className="row"><h1>{l.title}</h1><span className="rent big">₹{l.rent.toLocaleString('en-IN')}/mo</span></div>
    <p className="muted">{l.address}, {l.city}. {l.roomType}. {l.available ? 'Available now' : 'Not available'}</p>
    <p>{l.description}</p>
    <h3>Facilities</h3><div>{l.amenities.length ? l.amenities.map(a => <span className="tag" key={a}>{a}</span>) : <span className="muted">None listed</span>}</div>
    <h3>Contact</h3><p className="muted">Listed by {l.owner?.name}{l.owner?.college ? ', ' + l.owner.college : ''}</p>
    {mine ? <Link className="btn" to={'/edit/' + l._id}>Edit listing</Link> : user ? (
      <form className="box" onSubmit={send}><label>Send an enquiry<textarea rows="4" value={msg} onChange={e => setMsg(e.target.value)} placeholder="Introduce yourself and ask about move-in dates." /></label><Err msg={ferr} /><button className="btn" disabled={busy}>{busy ? 'Sending…' : 'Send enquiry'}</button></form>
    ) : <p><Link to="/login" className="btn">Log in to send an enquiry</Link></p>}
  </section>);
}
