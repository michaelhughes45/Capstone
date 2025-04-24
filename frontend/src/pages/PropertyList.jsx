import React from 'react'
import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  // Local state for loading indicator
  const [loading, setLoading] = useState(true);

  // Access user data from Redux store
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to login if no user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Fetch the user's properties from the backend
  const getPropertyList = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}/properties`, {
        method: "GET"
      });
      const data = await response.json();
      console.log(data); // Debug log
      dispatch(setPropertyList(data)); // Update Redux state
      setLoading(false); // Stop loading spinner
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  // Load property list on component mount
  useEffect(() => {
    getPropertyList();
  }, []);

  // Render a loader until data is fetched
  return loading ? <Loader /> : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>

      {/* Map through each property and render a ListingCard */}
      <div className="list">
        {propertyList?.map(
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
            booking = false,
            showDelete = true, // Show delete button for properties on this page
          }) => (
            <ListingCard
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
              showDelete={showDelete}
            />
          )
        )}
      </div>

      <Footer />
    </>
  );
};

export default PropertyList;
