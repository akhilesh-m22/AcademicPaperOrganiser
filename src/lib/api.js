const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('api_token');
}

function setToken(token) {
  localStorage.setItem('api_token', token);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register({ name, email, password }) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (data.token) setToken(data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) setToken(data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function fetchPapers() {
  const res = await fetch(`${API_URL}/api/papers`);
  return res.json();
}

export async function fetchUserPapers(userId) {
  const res = await fetch(`${API_URL}/api/users/${userId}/papers`);
  return res.json();
}

export async function createPaper(payload) {
  const res = await fetch(`${API_URL}/api/papers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchPaperById(id) {
  const res = await fetch(`${API_URL}/api/papers/${id}`);
  return res.json();
}

export async function fetchTags() {
  const res = await fetch(`${API_URL}/api/tags`);
  return res.json();
}

export async function fetchAuthors() {
  const res = await fetch(`${API_URL}/api/authors`);
  return res.json();
}

export async function updatePaper(id, payload) {
  const res = await fetch(`${API_URL}/api/papers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deletePaper(id) {
  const res = await fetch(`${API_URL}/api/papers/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  return res.json();
}

export async function searchPapers(keyword) {
  const res = await fetch(`${API_URL}/api/papers/search/${encodeURIComponent(keyword)}`);
  return res.json();
}

export async function fetchPapersByTag(tagName) {
  const res = await fetch(`${API_URL}/api/papers/tag/${encodeURIComponent(tagName)}`);
  return res.json();
}

export async function fetchStatistics() {
  const res = await fetch(`${API_URL}/api/statistics`);
  return res.json();
}

export async function countUserPapers(userId) {
  const res = await fetch(`${API_URL}/api/functions/count-user-papers/${userId}`);
  return res.json();
}

export async function countPapersByTag(tagName) {
  const res = await fetch(`${API_URL}/api/functions/count-papers-by-tag/${encodeURIComponent(tagName)}`);
  return res.json();
}

export async function getRecentPapersCount(days = 7) {
  const res = await fetch(`${API_URL}/api/functions/recent-papers/${days}`);
  return res.json();
}

// Advanced Queries
export async function getPapersByYear() {
  const res = await fetch(`${API_URL}/api/queries/papers-by-year`);
  return res.json();
}

export async function getPapersWithManyAuthors() {
  const res = await fetch(`${API_URL}/api/queries/papers-with-many-authors`);
  return res.json();
}

export { getToken, setToken };
