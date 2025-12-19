import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  estimations: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const estimationSlice = createSlice({
  name: 'estimations',
  initialState,
  reducers: {
    setEstimations: (state, action) => {
      state.estimations = action.payload;
    },
    addEstimation: (state, action) => {
      state.estimations.push(action.payload);
    },
    updateEstimation: (state, action) => {
      const index = state.estimations.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.estimations[index] = action.payload;
      }
    },
    deleteEstimation: (state, action) => {
      state.estimations = state.estimations.filter(e => e.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setEstimations,
  addEstimation,
  updateEstimation,
  deleteEstimation,
  setLoading,
  setError,
  setFilters,
} = estimationSlice.actions;
export default estimationSlice.reducer;

