import { createContext, useContext, useState } from 'react';
const C = createContext();
export const useApp = () => useContext(C);
export function Provider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [toast, setToast] = useState(null);
  const notify = (text, type = 'ok') => { setToast({ text, type }); setTimeout(() => setToast(null), 3500); };
  const login = ({ token, user }) => { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); setUser(user); };
  const logout = () => { localStorage.clear(); setUser(null); };
  return <C.Provider value={{ user, login, logout, notify, toast }}>{children}</C.Provider>;
}
