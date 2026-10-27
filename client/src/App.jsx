import { Routes, Route, NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from './ctx';
import Home from './pages/Home'; import Browse from './pages/Browse'; import Detail from './pages/Detail';
import Auth from './pages/Auth'; import Dashboard from './pages/Dashboard'; import Form from './pages/Form'; import Roommates from './pages/Roommates';
const P = ({ children }) => { const { user } = useApp(); return user ? children : <Navigate to="/login" />; };
export default function App() {
  const { user, logout, toast, notify } = useApp(), nav = useNavigate();
  return (<>
    <header className="nav"><Link to="/" className="logo">Roomie Finder</Link>
      <nav>
        <NavLink to="/browse">Browse</NavLink>
        {user ? (<><NavLink to="/roommates">Roommates</NavLink><NavLink to="/add">Add listing</NavLink><NavLink to="/dashboard">Dashboard</NavLink>
          <button className="btn ghost" onClick={() => { logout(); notify('Logged out'); nav('/'); }}>Log out</button></>)
          : (<><NavLink to="/login">Log in</NavLink><Link to="/register" className="btn">Sign up</Link></>)}
      </nav></header>
    <main>
      <Routes>
        <Route path="/" element={<Home />} /><Route path="/browse" element={<Browse />} /><Route path="/listings/:id" element={<Detail />} />
        <Route path="/login" element={<Auth mode="login" />} /><Route path="/register" element={<Auth mode="register" />} />
        <Route path="/dashboard" element={<P><Dashboard /></P>} /><Route path="/add" element={<P><Form /></P>} />
        <Route path="/edit/:id" element={<P><Form /></P>} /><Route path="/roommates" element={<P><Roommates /></P>} />
        <Route path="*" element={<div className="empty"><h3>Page not found</h3><Link to="/">Back to home</Link></div>} />
      </Routes></main>
    <footer className="foot">Roomie Finder, a college project. Listings are posted by students.</footer>
    {toast && <div className={'toast ' + toast.type} role="status">{toast.text}</div>}
  </>);
}
