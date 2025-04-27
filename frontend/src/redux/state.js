// Import createSlice from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Initial state of the Redux store
const initialState = {
  user: null,   // Holds user information (e.g., after login)
  token: null,  // Holds authentication token (JWT)
  listings: []  // Holds property listings (optional: added here for cleaner design)
};

// Create a Redux slice for user-related actions and state
export const userSlice = createSlice({
  name: "user",        // Name of this slice
  initialState,        // Set the initial state defined above
  reducers: {          // Define actions (reducers) to manipulate the state

    // Action to set user and token upon login
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // Action to clear user and token upon logout
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.listings = [];
    },

    // Action to set the listings array (used for homepage, search, category pages)
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },

    // Action to safely update the user's trip list (future and past trips)
    setTripList: (state, action) => {
      if (state.user) {
        state.user.tripList = action.payload;
      }
    },

    // Action to safely update the user's wishlist (saved properties)
    setWishList: (state, action) => {
      if (state.user) {
        state.user.wishList = action.payload;
      }
    },

    // Action to safely update the user's property list (properties they created)
    setPropertyList: (state, action) => {
      if (state.user) {
        state.user.propertyList = action.payload;
      }
    },

    // Action to safely update the user's reservation list (reservations received as host)
    setReservationList: (state, action) => {
      if (state.user) {
        state.user.reservationList = action.payload;
      }
    }
  }
});

// Export the action creators generated from the slice
export const { 
  setLogin, 
  setLogout, 
  setListings, 
  setTripList, 
  setWishList, 
  setPropertyList, 
  setReservationList 
} = userSlice.actions;

// Export the reducer to be used in the Redux store
export default userSlice.reducer;
