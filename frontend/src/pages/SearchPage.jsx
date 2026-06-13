// Hook to get dynamic route parameters (e.g. /search/:search)
import { useParams } from "react-router-dom";
import "../styles/List.scss"

// Redux hooks
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";

// React hooks and components
import { useEffect, useState } from "react";
import Loader from "../components/Loader"
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

const SearchPage = () => {
  // Local state to handle loading spinner
  const [loading, setLoading] = useState(true)

  // Extract the 'search' parameter from the URL
  const { search } = useParams()

  // Get the listings data from Redux store
  const listings = useSelector((state) => state.listings)

  // Redux dispatch
  const dispatch = useDispatch()

  // Fetch listings from server based on the search term
  const getSearchListings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/search/${search}`, {
        method: "GET"
      })

      const data = await response.json()

      // Store the fetched listings in Redux state
      dispatch(setListings({ listings: data }))

      // Turn off loading spinner
      setLoading(false)
    } catch (err) {
      console.log("Fetch Search List failed!", err.message)
    }
  }

  // Re-fetch listings whenever the `search` term changes
  useEffect(() => {
    getSearchListings()
  }, [search])
  
  // If loading, show loader component
  return loading ? <Loader /> : (
    <>
      <Navbar />

      {/* Show the search term as page title */}
      <h1 className="title-list">{search}</h1>

      {/* Render listings as cards */}
      <div className="list">
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
            booking = false, // default to false unless booking info is passed
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
}

export default SearchPage
