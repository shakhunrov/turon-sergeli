import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../shared/api';

// ── Thunks ────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/token/', { username, password });
      // Persist tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('globalBranchId', data?.user?.branch?.id)
      return data; // { access, refresh }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || 'Login failed. Check your credentials.',
      );
    }
  },
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) return rejectWithValue('No refresh token');

      const { data } = await api.post('/token/refresh/', { refresh });
      localStorage.setItem('access_token', data.access);
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      return data;
    } catch (err) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return rejectWithValue('Session expired');
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuth: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuth = false;
      state.error = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── login ──
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.accessToken = payload.access;
        state.refreshToken = payload.refresh;
        state.isAuth = true;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── refresh ──
    builder
      .addCase(refreshTokenThunk.fulfilled, (state, { payload }) => {
        state.accessToken = payload.access;
        if (payload.refresh) state.refreshToken = payload.refresh;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuth = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────
export const selectAuth = (state) => state.auth;
export const selectIsAuth = (state) => state.auth.isAuth;

export default authSlice.reducer;
