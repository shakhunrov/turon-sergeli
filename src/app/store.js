import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth';
import { contactReducer } from '../features/contact';
import { positionsReducer, applicationsReducer } from '../features/careers';
import { admissionsReducer } from '../features/admissions';
import { newsReducer } from '../features/news';
import { categoriesReducer } from '../features/categories';

const store = configureStore({
  reducer: {
    auth: authReducer,
    contact: contactReducer,
    positions: positionsReducer,
    applications: applicationsReducer,
    admissions: admissionsReducer,
    news: newsReducer,
    categories: categoriesReducer,
  },
});

export default store;



