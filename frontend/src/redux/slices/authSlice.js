import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial auth state from localStorage if available
const token = localStorage.getItem('token');
const userJson = localStorage.getItem('user');
let user = null;
try {
  user = userJson ? JSON.parse(userJson) : null;
} catch (e) {
  localStorage.removeItem('user');
}

const initialState = {
  token: token || null,
  user: user || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    clearError(state) {
      state.error = null;
    },
    incrementSolvedCount(state) {
      if (state.user) {
        state.user.solvedCount = (state.user.solvedCount || 0) + 1;
        if (state.user.streak === 0 || !state.user.streak) {
          state.user.streak = 1;
        } else {
          state.user.streak += 1;
        }
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile, clearError, incrementSolvedCount } = authSlice.actions;
export default authSlice.reducer;
