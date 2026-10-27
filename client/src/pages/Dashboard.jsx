import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useApp } from '../ctx';
import { Empty, Spinner, Err } from '../components';
export default function Dashboard() {
  const { user, notify } = useApp(), [ls, setLs] = useState(null), [en, setEn] = useState(null), [err, setErr] = useState('');
  const load = () => Promise.all([api('/listings/mine'), api('/enquiries/mine')]).then(([a, b]) => { setLs(a); setEn(b); }).catch(e => setErr(e.message));
  useEffect(() => { load(); }, []);
  const del = async l => { if (!confirm('Delete "' + l.title + '"?')) return; try { await api('/listings/' + l._id, { method: 'DELETE' }); notify('Listing deleted'); load(); } catch (e) { notify(e.message, 'err'); } };
  const reply = async (e, status) => { try { await api('/enquiries/' + e._id, { method: 'PATCH', body: { status } }); notify('Enquiry ' + status); load(); } catch (x) { notify(x.message, 'err'); } };
  if (err) return <Err msg={err} />; if (!ls || !en) return <Spinner />;
  return (<section><h2>Hi, {user.name}</h2>
    <h3>Your listings</h3>{ls.length ? ls.map(l => <div className="box row" key={l._id}><div><Link to={'/listings/' + l._id}><b>{l.title}</b></Link><p className="muted">{l.city}, ₹{l.rent}/mo</p></div><div><Link className="btn ghost" to={'/edit/' + l._id}>Edit</Link> <button className="btn danger" onClick={() => del(l)}>Delete</button></div></div>) : <Empty title="No listings yet"><Link to="/add">Add your first accommodation</Link></Empty>}
    <h3>Incoming enquiries</h3>{en.incoming.length ? en.incoming.map(e => <div className="box" key={e._id}><b>{e.from?.name}</b> on {e.listing?.title} <span className={'tag ' + e.status}>{e.status}</span><p>{e.message}</p><p className="muted">{e.from?.email}</p>
      {e.status === 'pending' && <><button className="btn" onClick={() => reply(e, 'accepted')}>Accept</button> <button className="btn ghost" onClick={() => reply(e, 'declined')}>Decline</button></>}</div>) : <Empty title="No incoming enquiries">They appear here when someone contacts you.</Empty>}
    <h3>Your enquiries</h3>{en.outgoing.length ? en.outgoing.map(e => <div className="box" key={e._id}>To <b>{e.to?.name}</b> about {e.listing?.title} <span className={'tag ' + e.status}>{e.status}</span><p>{e.message}</p>{e.status === 'accepted' && <p>Contact: {e.to.email}</p>}</div>) : <Empty title="No enquiries sent">Open a listing and send one.</Empty>}
  </section>);
}
