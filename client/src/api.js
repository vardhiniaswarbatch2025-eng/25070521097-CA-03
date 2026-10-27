export async function api(path, { method = 'GET', body } = {}) {
  const t = localStorage.getItem('token');
  const r = await fetch('/api' + path, { method, headers: { 'Content-Type': 'application/json', ...(t && { Authorization: 'Bearer ' + t }) }, body: body && JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { if (r.status === 401 && t) { localStorage.clear(); } throw new Error(d.message || 'Request failed. Is the server running?'); }
  return d;
}
