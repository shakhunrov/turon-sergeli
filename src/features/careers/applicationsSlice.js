import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../shared/api';

const APPLY_ENDPOINT = '/website-sources/careers/apply/';
const ADMIN_LIST_ENDPOINT = '/website-sources/admin/careers/applications/';
const STATUS_ENDPOINT = '/website-sources/careers/'; // PUT /{id}/

// ── Thunks ────────────────────────────────────────────────────────

// Public: apply for a position
export const applyForPosition = createAsyncThunk(
    'applications/apply',
    async (applicationData, { rejectWithValue }) => {
        try {
            // applicationData: { name, email, phone, position, cv_file? }
            // If cv_file is a File object, use FormData
            let body;
            if (applicationData.cv_file instanceof File) {
                body = new FormData();
                Object.entries(applicationData).forEach(([key, val]) => {
                    if (val !== undefined && val !== null) {
                        body.append(key, val);
                    }
                });
            } else {
                body = applicationData;
            }

            const { data } = await api.post(APPLY_ENDPOINT, body, {
                headers: body instanceof FormData
                    ? { 'Content-Type': 'multipart/form-data' }
                    : undefined,
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to submit application');
        }
    },
);

// Admin: fetch applications list with filters
export const fetchApplications = createAsyncThunk(
    'applications/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            // filters: { branch, status, position, date_from, date_to }
            const params = {};
            if (filters.branch) params.branch = filters.branch;
            if (filters.status) params.status = filters.status;
            if (filters.position) params.position = filters.position;
            if (filters.date_from) params.date_from = filters.date_from;
            if (filters.date_to) params.date_to = filters.date_to;

            const { data } = await api.get(ADMIN_LIST_ENDPOINT, { params });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch applications');
        }
    },
);

// Admin: delete application (DELETE)
export const deleteApplication = createAsyncThunk(
    'applications/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${ADMIN_LIST_ENDPOINT}${id}/`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to delete application');
        }
    },
);

// Admin: update application status (PUT)
export const updateApplicationStatus = createAsyncThunk(
    'applications/updateStatus',
    async ({ id, status, cv_file }, { rejectWithValue }) => {
        try {
            let body;
            if (cv_file instanceof File) {
                body = new FormData();
                body.append('status', status);
                body.append('cv_file', cv_file);
            } else {
                body = { status };
            }

            const { data } = await api.put(`${STATUS_ENDPOINT}${id}/`, body, {
                headers: body instanceof FormData
                    ? { 'Content-Type': 'multipart/form-data' }
                    : undefined,
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to update application status');
        }
    },
);
// PATCH /website-sources/applications/<id>/upload-cv/
export const uploadApplicationCV = createAsyncThunk(
    'careers/uploadApplicationCV',
    async ({ id, cvFile }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('cv_file', cvFile);

            const { data } = await api.patch(
                `/website-sources/applications/${id}/upload-cv/`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to upload CV');
        }
    }
);
// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
    applications: [],
    loading: false,
    error: null,
    applySuccess: false,
};

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        resetApplyStatus(state) {
            state.applySuccess = false;
            state.error = null;
        },
        clearApplicationsError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ── apply ──
        builder
            .addCase(uploadApplicationCV.fulfilled, (state, { payload }) => {
                const idx = state.applications.findIndex((a) => a.id === payload.id);
                if (idx !== -1) state.applications[idx] = payload;
            })
            .addCase(applyForPosition.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.applySuccess = false;
            })
            .addCase(applyForPosition.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.applySuccess = true;
                state.applications.push(payload);
            })
            .addCase(applyForPosition.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // ── fetch list ──
        builder
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.applications = payload;
            })
            .addCase(fetchApplications.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // ── update status ──
        builder
            .addCase(updateApplicationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, { payload }) => {
                state.loading = false;
                const idx = state.applications.findIndex((a) => a.id === payload.id);
                if (idx !== -1) state.applications[idx] = payload;
            })
            .addCase(updateApplicationStatus.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // ── delete ──
        builder
            .addCase(deleteApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteApplication.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.applications = state.applications.filter((a) => a.id !== payload);
            })
            .addCase(deleteApplication.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export const { resetApplyStatus, clearApplicationsError } = applicationsSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────
export const selectApplications = (state) => state.applications.applications;
export const selectApplicationsLoading = (state) => state.applications.loading;
export const selectApplicationsError = (state) => state.applications.error;
export const selectApplySuccess = (state) => state.applications.applySuccess;

export default applicationsSlice.reducer;