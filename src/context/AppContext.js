import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserData = useCallback(async () => {
    const user = await api.getMe();
    setCurrentUser(user);

    const [tasksRes, groupRes, completionsRes, redemptionsRes] = await Promise.allSettled([
      api.getTasks(),
      user.groupId ? api.getMyGroup() : Promise.resolve(null),
      api.getGroupCompletions(100),
      api.getRedemptions(100),
    ]);

    if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value);
    if (groupRes.status === 'fulfilled' && groupRes.value) {
      setGroup(groupRes.value);
      const rewardsData = await api.getRewards().catch(() => []);
      setRewards(rewardsData);
    }
    if (completionsRes.status === 'fulfilled') setCompletions(completionsRes.value);
    if (redemptionsRes.status === 'fulfilled') setRedemptions(redemptionsRes.value);
  }, []);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      loadUserData()
        .catch(() => { api.clearToken(); setCurrentUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadUserData]);

  async function login(email, password) {
    const { token, user } = await api.login(email, password);
    api.setToken(token);
    setCurrentUser(user);
    setLoading(true);
    await loadUserData().catch(() => {});
    setLoading(false);
  }

  async function register(name, email, password, avatar) {
    const { token, user } = await api.register(name, email, password, avatar);
    api.setToken(token);
    setCurrentUser(user);
    setLoading(true);
    await loadUserData().catch(() => {});
    setLoading(false);
  }

  function logout() {
    api.clearToken();
    setCurrentUser(null);
    setGroup(null);
    setTasks([]);
    setRewards([]);
    setCompletions([]);
    setRedemptions([]);
  }

  async function createGroup(name) {
    await api.createGroup(name);
    const updatedUser = await api.getMe();
    setCurrentUser(updatedUser);
    const groupData = await api.getMyGroup();
    setGroup(groupData);
    const rewardsData = await api.getRewards().catch(() => []);
    setRewards(rewardsData);
  }

  async function joinGroup(code) {
    await api.joinGroup(code);
    const updatedUser = await api.getMe();
    setCurrentUser(updatedUser);
    const groupData = await api.getMyGroup();
    setGroup(groupData);
    const [rewardsData, completionsData] = await Promise.all([
      api.getRewards().catch(() => []),
      api.getGroupCompletions(100).catch(() => []),
    ]);
    setRewards(rewardsData);
    setCompletions(completionsData);
  }

  async function leaveGroup() {
    await api.leaveGroup();
    const updatedUser = await api.getMe();
    setCurrentUser(updatedUser);
    setGroup(null);
    setRewards([]);
  }

  async function dispatch({ type, payload }) {
    try {
      switch (type) {
        case 'COMPLETE_TASK': {
          const { completion, user } = await api.completeTask(payload.taskId);
          setCurrentUser(user);
          setCompletions(prev => {
            const task = tasks.find(t => t.id === payload.taskId);
            return [{ ...completion, task, user }, ...prev];
          });
          if (group) {
            setGroup(prev => ({
              ...prev,
              members: prev.members.map(m =>
                m.id === user.id ? { ...m, points: user.points, totalPoints: user.totalPoints } : m
              ),
            }));
          }
          break;
        }

        case 'REDEEM_REWARD': {
          const { redemption, user } = await api.redeemReward(payload.rewardId);
          setCurrentUser(user);
          const reward = rewards.find(r => r.id === payload.rewardId);
          setRedemptions(prev => [{ ...redemption, reward }, ...prev]);
          setRewards(prev =>
            prev.map(r => r.id === payload.rewardId && r.stock > 0 ? { ...r, stock: r.stock - 1 } : r)
          );
          if (group) {
            setGroup(prev => ({
              ...prev,
              members: prev.members.map(m =>
                m.id === user.id ? { ...m, points: user.points } : m
              ),
            }));
          }
          break;
        }

        case 'ADD_TASK': {
          const newTask = await api.createTask(payload);
          setTasks(prev => [...prev, newTask]);
          break;
        }

        case 'DELETE_TASK': {
          await api.deleteTask(payload.taskId);
          setTasks(prev => prev.filter(t => t.id !== payload.taskId));
          break;
        }

        case 'ADD_REWARD': {
          const newReward = await api.createReward(payload);
          setRewards(prev => [...prev, newReward]);
          break;
        }

        case 'DELETE_REWARD': {
          await api.deleteReward(payload.rewardId);
          setRewards(prev => prev.filter(r => r.id !== payload.rewardId));
          break;
        }

        case 'UPDATE_PROFILE': {
          const updated = await api.updateProfile(payload.name, payload.avatar);
          setCurrentUser(updated);
          if (group) {
            setGroup(prev => ({
              ...prev,
              members: prev.members.map(m =>
                m.id === updated.id ? { ...m, name: updated.name, avatar: updated.avatar } : m
              ),
            }));
          }
          break;
        }

        case 'UPDATE_GROUP_NAME': {
          const updatedGroup = await api.updateGroupName(payload.name);
          setGroup(prev => ({ ...prev, name: updatedGroup.name }));
          break;
        }

        default:
          break;
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 4000);
      throw err;
    }
  }

  const members = group?.members || (currentUser ? [currentUser] : []);

  const state = {
    currentUserId: currentUser?.id,
    users: members,
    group: group || { id: null, name: 'Sem grupo', code: '', memberIds: [] },
    tasks,
    rewards,
    completions,
    redemptions,
  };

  const getGroupRanking = () =>
    [...members].sort((a, b) => b.totalPoints - a.totalPoints);

  const getUserCompletions = (userId) =>
    completions.filter(c => c.userId === userId);

  const canCompleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    if (task.isRecurring) return true;
    return !completions.some(c => c.taskId === taskId && c.userId === currentUser?.id);
  };

  const getRecentCompletions = (limit = 10) =>
    completions.slice(0, limit);

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      currentUser,
      loading,
      error,
      login,
      register,
      logout,
      createGroup,
      joinGroup,
      leaveGroup,
      getGroupRanking,
      getUserCompletions,
      canCompleteTask,
      getRecentCompletions,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
