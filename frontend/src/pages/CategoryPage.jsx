import { useState, useEffect } from "react";
import "../styles/List.scss"; // Styles for listing layout
import Navbar from "../components/Navbar"; // Navigation bar component
import { useParams } from "react-router-dom"; // For accessing route parameters
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { setListings } from "../redux/state"; // Redux action to update listings in the store
import Loader from "../components/Loader"; // Loading spinner component
import ListingCard from "../components/ListingCard"; // Component to display individual listings
import Footer from "../components/Footer"; // Footer component

const CategoryPage = () => {
  const [loading, setLoading] = useState(true); // Local state to track loading status

  const { category } = useParams(); // Extract category name from URL parameters

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings); // Get listings from Redux store

  // Function to fetch listings by selected category from the backend
  const getFeedListings = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/properties?category=${category}`, // API endpoint with category filter
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setListings({ listings: data })); // Update listings in Redux store
      setLoading(false); // Stop showing loader
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  // Fetch listings every time the category changes
  useEffect(() => {
    getFeedListings();
  }, [category]);

  // Show loader while data is being fetched
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      <div className="list">
        {/* Render each listing as a ListingCard */}
        {listings?.map(
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
      <Footer />
    </>
  );
};

export default CategoryPage;
