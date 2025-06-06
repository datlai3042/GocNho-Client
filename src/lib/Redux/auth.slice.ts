import { UserType } from "@/app/modules/User/index.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
      user?: UserType | null;
};

const initialState: InitialState = {
      user: null,
};

const authenticationSlice = createSlice({
      name: "authentication",
      initialState,
      reducers: {
            onFetchUser: (state, payload: PayloadAction<{ user: UserType }>) => {
                  state.user = { ...payload.payload.user };
            },

            onLogout: (state) => {
                  state.user = null;
            },
      },
});

export const { onFetchUser, onLogout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
