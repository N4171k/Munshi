import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',    // Options: "light" or "dark"
    language: 'English',    // Options: "EN", "FR", etc.
    incognito: false,  // Boolean flag: false = normal mode, true = incognito mode
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setIncognito: (state, action) => {
            state.incognito = action.payload;
        },
        toggleIncognito: (state) => {
            state.incognito = !state.incognito;
        },
    },
});

export const { setTheme, setLanguage, setIncognito, toggleIncognito } = uiSlice.actions;
export default uiSlice.reducer;
