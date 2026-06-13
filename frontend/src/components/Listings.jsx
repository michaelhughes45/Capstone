import { useEffect, useState } from 'react';
import { categories } from "../data.jsx";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";

const Listings = () => {
  const dispatch = useDispatch();

  // Tracks whether data is still loading
  const [loading, setLoading] = useState(true);

  // Category currently selected by the user
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get the listings state from Redux store
  const listings = useSelector((state) => state.listings);

  // Fetch listings based on selected category (or all listings)
  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== "All"
          ? `${import.meta.env.VITE_API_URL}/properties?category=${selectedCategory}`
          : `${import.meta.env.VITE_API_URL}/properties`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      // Store listings in Redux and stop loading spinner
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  // Re-fetch listings whenever the selected category changes
  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  return (
    <>
      {/* Category selection menu */}
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${category.label === selectedCategory ? "selected" : ""}`}
            key={index}
            onClick={() => setSelectedCategory(category.label)} // Update selected category on click
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {/* Display loader while fetching, otherwise show listing cards */}
      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {listings.map(
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
              booking = false // Default to false if not passed
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
          )}
        </div>
      )}
    </>
  );
};

export default Listings;
