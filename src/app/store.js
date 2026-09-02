import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '../features/quiz/quizSlice';
import leadFormReducer from '../features/leadForm/leadFormSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    leadForm: leadFormReducer,
    ui: uiReducer,
  },
});
