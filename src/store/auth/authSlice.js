import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const initialState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userLoggedIn: (state, { payload }) => {
            Cookies.set('token', payload.token);
            Cookies.set('user', JSON.stringify(payload.user));
            state.user = payload.user;
        },
        userLoggedOut: (state) => {
            Cookies.remove('token');
            Cookies.remove('user');
            state.user = "";
        }
    }
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;