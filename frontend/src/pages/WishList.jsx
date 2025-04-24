import React from 'react'
import "../styles/List.scss"
import { useSelector, useDispatch } from "react-redux"
import Navbar from "../components/Navbar"
import ListingCard from "../components/ListingCard"
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const WishList = () => {
  // Retrieve the wish list from Redux store (default to empty array if undefined)
  const wishList = useSelector((state) => state.user?.wishList || [])

  const dispatch = useDispatch()

  // Get the current user and userId from Redux store
  const user = useSelector((state) => state.user)
  const userId = user?._id

  const navigate = useNavigate()

  // Redirect user to login page if they are not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
    }
  }, [user, navigate])

  return (
    <>
      <Navbar />

      {/* Page title */}
      <h1 className="title-list">Your Wish List</h1>

      {/* Listings container */}
      <div className="list">
        {/* Map through each listing in the wish list and render a ListingCard for each */}
        {wishList?.map(
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
            booking = false, // default to false unless provided
          }) => (
            <ListingCard
              key={_id} // unique key for React list rendering
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
  )
}

export default WishList
