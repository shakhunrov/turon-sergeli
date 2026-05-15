import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../shared/api';

const ENDPOINT = 'website-sources/public/news/';

// ── Thunks ────────────────────────────────────────────────────────

// GET list with filters
export const fetchNews = createAsyncThunk(
    'news/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = {};
            if (filters.branch) params.branch = filters.branch;
            if (filters.published !== undefined) params.published = filters.published;
            if (filters.category_id) params.category_id = filters.category_id;
            if (filters.date_from) params.date_from = filters.date_from;
            if (filters.date_to) params.date_to = filters.date_to;
            if (filters.created_by) params.created_by = filters.created_by;

            const { data } = await api.get(ENDPOINT, { params });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch news');
        }
    },
);

// GET single news profile
export const fetchNewsById = createAsyncThunk(
    'news/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`${ENDPOINT}${id}/`);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to fetch news item');
        }
    },
);

// POST create news (supports image as File via FormData)
export const createNews = createAsyncThunk(
    'news/create',
    async (newsData, { rejectWithValue }) => {
        try {
            let body;
            if (newsData.image instanceof File) {
                body = new FormData();
                Object.entries(newsData).forEach(([key, val]) => {
                    if (val !== undefined && val !== null) {
                        body.append(key, val);
                    }
                });
            } else {
                // If image is a URL string or empty, send as JSON (no image field)
                const { image, ...rest } = newsData;
                body = rest;
            }

            const config = body instanceof FormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : {};

            const { data } = await api.post(ENDPOINT, body, config);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to create news');
        }
    },
);

// PUT update news (supports image as File via FormData)
export const updateNews = createAsyncThunk(
    'news/update',
    async ({ id, ...fields }, { rejectWithValue }) => {
        try {
            let body;
            if (fields.image instanceof File) {
                body = new FormData();
                Object.entries(fields).forEach(([key, val]) => {
                    if (val !== undefined && val !== null) {
                        body.append(key, val);
                    }
                });
            } else {
                body = fields;
            }

            const config = body instanceof FormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : {};

            const { data } = await api.put(`${ENDPOINT}${id}/`, body, config);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to update news');
        }
    },
);

// DELETE news
export const deleteNews = createAsyncThunk(
    'news/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${ENDPOINT}${id}/`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to delete news');
        }
    },
);
// PATCH /website-sources/news/<id>/upload-image/
export const uploadNewsImage = createAsyncThunk(
    'news/uploadImage',
    async ({ id, imageFile }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const { data } = await api.patch(
                `/website-sources/news/${id}/upload-image/`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Failed to upload image');
        }
    }
);
// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
    newsList: [],
    currentNews: null,
    loading: false,
    error: null,
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        clearNewsError(state) {
            state.error = null;
        },
        clearCurrentNews(state) {
            state.currentNews = null;
        },
    },
    extraReducers: (builder) => {
        // ── fetch all ──

        builder
            .addCase(fetchNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNews.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.newsList = payload;
            })
            .addCase(fetchNews.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(uploadNewsImage.fulfilled, (state, { payload }) => {
                const idx = state.newsList.findIndex((n) => n.id === payload.id);
                if (idx !== -1) state.newsList[idx] = payload;
            })

        // ── fetch by id ──
        builder
            .addCase(fetchNewsById.fulfilled, (state, { payload }) => {
                state.currentNews = payload;
            });

        // ── create ──
        builder
            .addCase(createNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNews.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.newsList.unshift(payload);
            })
            .addCase(createNews.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // ── update ──
        builder
            .addCase(updateNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNews.fulfilled, (state, { payload }) => {
                state.loading = false;
                const idx = state.newsList.findIndex((n) => n.id === payload.id);
                if (idx !== -1) state.newsList[idx] = payload;
            })
            .addCase(updateNews.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // ── delete ──
        builder
            .addCase(deleteNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNews.fulfilled, (state, { payload: id }) => {
                state.loading = false;
                state.newsList = state.newsList.filter((n) => n.id !== id);
            })
            .addCase(deleteNews.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export const { clearNewsError, clearCurrentNews } = newsSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────
export const selectNewsList = (state) => state.news.newsList;
export const selectCurrentNews = (state) => state.news.currentNews;
export const selectNewsLoading = (state) => state.news.loading;
export const selectNewsError = (state) => state.news.error;

export default newsSlice.reducer;