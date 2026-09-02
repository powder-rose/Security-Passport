import { createSlice } from '@reduxjs/toolkit';
import { quizQuestions } from './quizData';

const initialState = {
  currentStep: 0,
  answers: {},
  completed: false,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    answerQuestion(state, action) {
      const { questionId, value } = action.payload;
      state.answers[questionId] = value;
    },
    nextStep(state) {
      state.currentStep = Math.min(state.currentStep + 1, quizQuestions.length - 1);
    },
    previousStep(state) {
      state.currentStep = Math.max(0, state.currentStep - 1);
    },
    goToStep(state, action) {
      const step = Number(action.payload);
      if (Number.isInteger(step)) {
        state.currentStep = Math.min(Math.max(step, 0), quizQuestions.length - 1);
      }
    },
    completeQuiz(state) {
      state.completed = true;
    },
    resetQuiz() {
      return initialState;
    },
  },
});

export const {
  answerQuestion,
  nextStep,
  previousStep,
  goToStep,
  completeQuiz,
  resetQuiz,
} = quizSlice.actions;
export default quizSlice.reducer;
