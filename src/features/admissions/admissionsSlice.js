import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../shared/api';

const PUBLIC_ENDPOINT = '/website-sources/admissions/';
const ADMIN_ENDPOINT = '/website-sources/admin/admissions/';

// ── Thunks ────────────────────────────────────────────────────────

// Public: submit admission form
export const submitAdmission = createAsyncThunk(
  'admissions/submit',
  async (admissionData, { rejectWithValue }) => {
    // admissionData: { student_name, phone, grade, branch }
    try {
      const { data } = await api.post(PUBLIC_ENDPOINT, admissionData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to submit admission');
    }
  },
);

// Admin: fetch all admissions with filters
export const fetchAdmissions = createAsyncThunk(
  'admissions/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (filters.branch) params.branch = filters.branch;
      if (filters.status) params.status = filters.status;
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;

      const { data } = await api.get(ADMIN_ENDPOINT, { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch admissions');
    }
  },
);

// Admin: get single admission profile
export const fetchAdmissionById = createAsyncThunk(
  'admissions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${ADMIN_ENDPOINT}${id}/`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch admission');
    }
  },
);

// Admin: update admission status (PATCH)
export const updateAdmissionStatus = createAsyncThunk(
  'admissions/updateStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`${ADMIN_ENDPOINT}${id}/status/`, { status, notes });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update status');
    }
  },
);

// Admin: delete admission
export const deleteAdmission = createAsyncThunk(
  'admissions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${ADMIN_ENDPOINT}${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete admission');
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
  admissions: [],
  currentAdmission: null,
  loading: false,
  error: null,
  submitSuccess: false,
};

const admissionsSlice = createSlice({
  name: 'admissions',
  initialState,
  reducers: {
    resetAdmissionStatus(state) {
      state.submitSuccess = false;
      state.error = null;
    },
    clearAdmissionsError(state) {
      state.error = null;
    },
    clearCurrentAdmission(state) {
      state.currentAdmission = null;
    },
  },
  extraReducers: (builder) => {
    // ── submit ──
    builder
      .addCase(submitAdmission.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitAdmission.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.submitSuccess = true;
        state.admissions.push(payload);
      })
      .addCase(submitAdmission.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── fetch all ──
    builder
      .addCase(fetchAdmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.admissions = payload;
      })
      .addCase(fetchAdmissions.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── fetch by id ──
    builder
      .addCase(fetchAdmissionById.fulfilled, (state, { payload }) => {
        state.currentAdmission = payload;
      });

    // ── update status ──
    builder
      .addCase(updateAdmissionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmissionStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.admissions.findIndex((a) => a.id === payload.id);
        if (idx !== -1) state.admissions[idx] = payload;
        if (state.currentAdmission?.id === payload.id) state.currentAdmission = payload;
      })
      .addCase(updateAdmissionStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── delete ──
    builder
      .addCase(deleteAdmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdmission.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.admissions = state.admissions.filter((a) => a.id !== id);
      })
      .addCase(deleteAdmission.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { resetAdmissionStatus, clearAdmissionsError, clearCurrentAdmission } = admissionsSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────
export const selectAdmissions = (state) => state.admissions.admissions;
export const selectCurrentAdmission = (state) => state.admissions.currentAdmission;
export const selectAdmissionsLoading = (state) => state.admissions.loading;
export const selectAdmissionsError = (state) => state.admissions.error;
export const selectAdmissionSubmitSuccess = (state) => state.admissions.submitSuccess;

export default admissionsSlice.reducer;
