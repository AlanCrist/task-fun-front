import * as realApi from './api';
import * as mockApi from './mockApi';

const api = process.env.REACT_APP_USE_MOCK === 'true' ? mockApi : realApi;

export const {
  getToken, setToken, clearToken,
  login, register,
  getMe, updateProfile,
  getMyGroup, createGroup, joinGroup, updateGroupName, leaveGroup, getRanking,
  getTasks, createTask, deleteTask,
  getRewards, createReward, deleteReward,
  completeTask, getGroupCompletions, getMyCompletions,
  redeemReward, getRedemptions,
} = api;
