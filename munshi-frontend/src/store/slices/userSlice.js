import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  userData: null,
  transactions: [],
  stocks: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.userData = null;
      state.transactions = [];
      state.stocks = [];
    },
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload
    },
    setStocks: (state, action) => {
      const investmentsData = action.payload;
      const aggregatedInvestments = investmentsData.reduce((acc, curr) => {
        const code = curr.code;
        const amount = Number(curr.amount);
        if (acc[code]) {
          acc[code] += amount;
        } else {
          acc[code] = amount;
        }
        return acc;
      }, {});

      const aggregatedInvestmentsArray = Object.entries(aggregatedInvestments).map(([code, amount]) => ({
        code,
        amount,
      }));
      state.stocks = aggregatedInvestmentsArray
    }
  },
});

export const { setUser, setLoading, setError, logoutUser, setUserData, setTransactions, setStocks } = userSlice.actions;
export default userSlice.reducer;
