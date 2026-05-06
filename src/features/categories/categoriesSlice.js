import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../shared/api';

const ENDPOINT = '/website-sources/admin/categories/';

// ── Thunks ────────────────────────────────────────────────────────

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (filters.branch) params.branch = filters.branch;
      
      const { data } = await api.get(ENDPOINT, { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch categories');
    }
  },
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(ENDPOINT, categoryData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create category');
    }
  },
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, ...fields }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${ENDPOINT}${id}/`, fields);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update category');
    }
  },
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${ENDPOINT}${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete category');
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
  categoriesList: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoriesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.loading = false;
        // In case the API returns paginated format { results: [...] } or flat array
        state.categoriesList = Array.isArray(payload) ? payload : (payload.results || []);
      })
      .addCase(fetchCategories.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // create
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categoriesList.push(payload);
      })
      .addCase(createCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // update
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.categoriesList.findIndex((c) => c.id === payload.id);
        if (idx !== -1) state.categoriesList[idx] = payload;
      })
      .addCase(updateCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // delete
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.categoriesList = state.categoriesList.filter((c) => c.id !== id);
      })
      .addCase(deleteCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearCategoriesError } = categoriesSlice.actions;

export const selectCategoriesList = (state) => state.categories.categoriesList;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;

export default categoriesSlice.reducer;
