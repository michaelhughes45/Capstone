import { useEffect, useState } from "react";
import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

import { setPropertyList } from "../redux/state";

const PropertyList = () => {
  // State to control loading indicator while fetching data
  const [loading, setLoading] = useState(true);

  // Access user and their properties from Redux store
  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to login page if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Fetch properties created by the current user
  const getPropertyList = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user._id}/properties`);
      const data = await response.json();
      console.log(data); // Log response for debugging

      // Update Redux state with fetched properties
      dispatch(setPropertyList(data));

      // Hide loading spinner
      setLoading(false);
    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  // Fetch property list once when component mounts
  useEffect(() => {
    getPropertyList();
  }, []);

  // Show loader while data is being fetched
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>

      {/* Render user's property listings or show fallback text */}
      <div className="list">
        {propertyList?.length > 0 ? (
          propertyList.map(
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
              showDelete = true, // Show delete button for owner's own listings
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
                showDelete={showDelete}
              />
            )
          )
        ) : (
          // Fallback message when no properties are found
          <p>No properties listed.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default PropertyList;
