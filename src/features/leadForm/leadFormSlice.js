import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  source: null,
  status: 'idle',
};

const leadFormSlice = createSlice({
  name: 'leadForm',
  initialState,
  reducers: {
    openLeadForm(state, action) {
      state.isOpen = true;
      state.source = action.payload ?? null;
    },
    closeLeadForm(state) {
      state.isOpen = false;
    },
    setLeadStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { openLeadForm, closeLeadForm, setLeadStatus } = leadFormSlice.actions;
export default leadFormSlice.reducer;
