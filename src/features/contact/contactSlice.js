import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../shared/api';

const ENDPOINT = '/website-sources/contact/';

// ── Thunks ────────────────────────────────────────────────────────

export const fetchContacts = createAsyncThunk(
  'contact/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(ENDPOINT);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch contacts');
    }
  },
);

export const createContact = createAsyncThunk(
  'contact/create',
  async (contactData, { rejectWithValue }) => {
    // contactData: { name, email, message, branch }
    try {
      const { data } = await api.post(ENDPOINT, contactData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to send message');
    }
  },
);

export const updateContact = createAsyncThunk(
  'contact/update',
  async ({ id, ...fields }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`${ENDPOINT}${id}/`, fields);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update contact');
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
  contacts: [],
  loading: false,
  error: null,
  submitSuccess: false,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactStatus(state) {
      state.submitSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetch ──
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.contacts = payload;
      })
      .addCase(fetchContacts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── create ──
    builder
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(createContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.submitSuccess = true;
        state.contacts.push(payload);
      })
      .addCase(createContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── update ──
    builder
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.contacts.findIndex((c) => c.id === payload.id);
        if (idx !== -1) state.contacts[idx] = payload;
      })
      .addCase(updateContact.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { resetContactStatus } = contactSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────
export const selectContacts = (state) => state.contact.contacts;
export const selectContactLoading = (state) => state.contact.loading;
export const selectContactError = (state) => state.contact.error;
export const selectSubmitSuccess = (state) => state.contact.submitSuccess;

export default contactSlice.reducer;
