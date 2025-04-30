import React, { useEffect } from 'react';
import "../styles/List.scss";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const WishList = () => {
  // Get the wish list from Redux store (fallback to empty array if undefined)
  const wishList = useSelector((state) => state.user?.wishList || []);

  const dispatch = useDispatch();

  // Get current user from Redux store
  const user = useSelector((state) => state.user);
  const userId = user?._id;

  const navigate = useNavigate();

  // If user is not logged in, redirect them to the login page
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      {/* Top navigation bar */}
      <Navbar />

      {/* Page title */}
      <h1 className="title-list">Your Wish List</h1>

      {/* Wishlist listings */}
      <div className="list">
        {wishList?.length > 0 ? (
          // Render a ListingCard for each listing in the wish list
          wishList.map(
            ({
              _id,
              creator,
              listingPhotoPaths,
              city,
              state,
              country,
              category,
              type,
              price,
              booking = false, // Defaults to false if not provided
            }) => (
              <ListingCard
                key={_id}
                listingId={_id}
                creator={creator}
                listingPhotoPaths={listingPhotoPaths}
                city={city}
                state={state}
                country={country}
                category={category}
                type={type}
                price={price}
                booking={booking}
              />
            )
          )
        ) : (
          // Fallback message when wish list is empty
          <p>No items in your wish list.</p>
        )}
      </div>

      {/* Footer navigation */}
      <Footer />
    </>
  );
};

export default WishList;
