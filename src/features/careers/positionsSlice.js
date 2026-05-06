import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../shared/api';

const ADMIN_ENDPOINT = '/website-sources/admin/careers/positions/';
const PUBLIC_ENDPOINT = '/website-sources/careers/positions/';

// ── Thunks ────────────────────────────────────────────────────────

// Public: fetch positions list with optional filters
export const fetchPositions = createAsyncThunk(
  'positions/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // filters: { branch, type, employment_type, deadline_from, deadline_to }
      const params = {};
      if (filters.branch) params.branch = filters.branch;
      if (filters.type) params.type = filters.type;
      if (filters.employment_type) params.employment_type = filters.employment_type;
      if (filters.deadline_from) params.deadline_from = filters.deadline_from;
      if (filters.deadline_to) params.deadline_to = filters.deadline_to;

      const { data } = await api.get(PUBLIC_ENDPOINT, { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch positions');
    }
  },
);

// Admin: create position
export const createPosition = createAsyncThunk(
  'positions/create',
  async (positionData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(ADMIN_ENDPOINT, positionData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create position');
    }
  },
);

// Admin: update position (PUT)
export const updatePosition = createAsyncThunk(
  'positions/update',
  async ({ id, ...fields }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${ADMIN_ENDPOINT}${id}/`, fields);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update position');
    }
  },
);

// Admin: delete position
export const deletePosition = createAsyncThunk(
  'positions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${ADMIN_ENDPOINT}${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete position');
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
  positions: [],
  loading: false,
  error: null,
};

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    clearPositionsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetch ──
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPositions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.positions = payload;
      })
      .addCase(fetchPositions.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── create ──
    builder
      .addCase(createPosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPosition.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.positions.unshift(payload);
      })
      .addCase(createPosition.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── update ──
    builder
      .addCase(updatePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePosition.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.positions.findIndex((p) => p.id === payload.id);
        if (idx !== -1) state.positions[idx] = payload;
      })
      .addCase(updatePosition.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── delete ──
    builder
      .addCase(deletePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePosition.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.positions = state.positions.filter((p) => p.id !== id);
      })
      .addCase(deletePosition.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearPositionsError } = positionsSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────
export const selectPositions = (state) => state.positions.positions;
export const selectPositionsLoading = (state) => state.positions.loading;
export const selectPositionsError = (state) => state.positions.error;

export default positionsSlice.reducer;
