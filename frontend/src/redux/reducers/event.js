import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isLoading: true,
};

export const eventReducer = createReducer(initialState, (builder) => {
    builder
        // Event Create
        .addCase('eventCreateRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('eventCreateSuccess', (state, action) => {
            state.isLoading = false;
            state.event = action.payload;
            state.success = true;
        })
        .addCase('eventCreateFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        // Clear Errors
        .addCase('clearErrors', (state) => {
            state.error = null;
        });
});
