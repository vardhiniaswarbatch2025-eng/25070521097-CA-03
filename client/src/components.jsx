import { Link } from 'react-router-dom';
export const TYPES = ['Single room', 'Shared room', 'PG', 'Hostel', 'Flat'];
export const AMENITIES = ['WiFi', 'Food included', 'Laundry', 'AC', 'Parking', 'Attached bathroom', 'Furnished', 'Power backup'];
const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Crect width='400' height='240' fill='%23dfe9e4'/%3E%3C/svg%3E";
export const Card = ({ l }) => (
  <Link to={'/listings/' + l._id} className="card">
    <img src={l.imageUrl || PH} alt="" onError={e => { e.target.src = PH; }} />
    <div className="cb"><div className="row"><b>{l.title}</b><span className="rent">₹{l.rent.toLocaleString('en-IN')}/mo</span></div>
      <p className="muted">{l.city}, {l.roomType}</p>
      <div>{l.amenities.slice(0, 4).map(a => <span className="tag" key={a}>{a}</span>)}</div></div>
  </Link>);
export const Empty = ({ title, children }) => <div className="empty"><h3>{title}</h3><p className="muted">{children}</p></div>;
export const Spinner = () => <div className="spin" role="status" aria-label="Loading" />;
export const Err = ({ msg }) => msg ? <div className="alert" role="alert">{msg}</div> : null;
