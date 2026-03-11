const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'tarefas_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

// Auth
export const login = (email, password) =>
  request('POST', '/auth/login', { email, password });

export const register = (name, email, password, avatar) =>
  request('POST', '/auth/register', { name, email, password, avatar });

// Users
export const getMe = () => request('GET', '/users/me');
export const updateProfile = (name, avatar) =>
  request('PUT', '/users/me', { name, avatar });

// Groups
export const getMyGroup = () => request('GET', '/groups/my');
export const createGroup = (name) => request('POST', '/groups', { name });
export const joinGroup = (code) => request('POST', '/groups/join', { code });
export const updateGroupName = (name) => request('PUT', '/groups/my/name', { name });
export const leaveGroup = () => request('DELETE', '/groups/my/leave');
export const getRanking = (groupId) => request('GET', `/groups/${groupId}/ranking`);

// Tasks
export const getTasks = () => request('GET', '/tasks');
export const createTask = (data) => request('POST', '/tasks', data);
export const deleteTask = (id) => request('DELETE', `/tasks/${id}`);

// Rewards
export const getRewards = () => request('GET', '/rewards');
export const createReward = (data) => request('POST', '/rewards', data);
export const deleteReward = (id) => request('DELETE', `/rewards/${id}`);

// Completions
export const completeTask = (taskId) =>
  request('POST', '/completions', { taskId });
export const getGroupCompletions = (limit = 50) =>
  request('GET', `/completions/group?limit=${limit}`);
export const getMyCompletions = (limit = 50) =>
  request('GET', `/completions?limit=${limit}`);

// Redemptions
export const redeemReward = (rewardId) =>
  request('POST', '/redemptions', { rewardId });
export const getRedemptions = (limit = 50) =>
  request('GET', `/redemptions?limit=${limit}`);
