import { useEffect, useState } from "react"
import "../styles/List.scss"
import Loader from "../components/Loader"
import Navbar from "../components/Navbar"
import { useDispatch, useSelector } from "react-redux"
import { setTripList } from "../redux/state"
import ListingCard from "../components/ListingCard"
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom"

const TripList = () => {
  const [loading, setLoading] = useState(true)

  // Get current user from Redux store
  const user = useSelector((state) => state.user)
  const userId = user?._id

  // Get current stored trip list, or empty array if undefined
  // const tripList = user?.tripList || []

  // Local state to separate current and past trips
  const [currentTrips, setCurrentTrips] = useState([])
  const [pastTrips, setPastTrips] = useState([])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
    }
  }, [user, navigate])

  // Fetch trips from backend API
  const getTrips = async () => {
    if (!userId) return
    try {
      // Fetch both current and past trips in parallel
      const [currentRes, pastRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/trips/current`),
        fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/trips/past`)
      ])

      // Parse JSON responses
      const [currentData, pastData] = await Promise.all([
        currentRes.json(),
        pastRes.json()
      ])

      // Filter trips that belong to the current user
      const filteredCurrent = currentData.filter((trip) => trip.customerId._id === userId)
      const filteredPast = pastData.filter((trip) => trip.customerId._id === userId)

      // Update local state with filtered results
      setCurrentTrips(filteredCurrent)
      setPastTrips(filteredPast)

      // Store combined list in Redux state
      dispatch(setTripList([...filteredCurrent, ...filteredPast]))

      setLoading(false)
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message)
    }
  }

  // Run trip fetch on mount
  useEffect(() => {
    getTrips()
  }, [])

  // If still not authenticated, render a message
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="trip-list-container">
          <h1 className="title-list">You must be logged in to view trips.</h1>
          <Footer />
        </div>
      </>
    )
  }

  // Render loader if still loading
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="trip-list-container">

        {/* Current Trips */}
        <h1 className="title-list">Your Current Trips</h1>
        <div className="list">
          {currentTrips?.length > 0 ? (
            currentTrips.map(({ _id, listingId, hostId, startDate, endDate, totalPrice }) => (
              <ListingCard
                key={_id}
                bookingId={_id}
                listingId={listingId._id}
                creator={hostId._id}
                listingPhotoPaths={listingId.listingPhotoPaths}
                city={listingId.city}
                state={listingId.state}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={true}
              />
            ))
          ) : (
            <p>No upcoming trips.</p>
          )}
        </div>

        {/* Past Trips */}
        <h1 className="title-list">Your Past Trips</h1>
        <div className="list">
          {pastTrips?.length > 0 ? (
            pastTrips.map(({ _id, listingId, hostId, startDate, endDate, totalPrice }) => (
              <ListingCard
                key={_id}
                listingId={listingId._id}
                creator={hostId._id}
                listingPhotoPaths={listingId.listingPhotoPaths}
                city={listingId.city}
                state={listingId.state}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={true}
              />
            ))
          ) : (
            <p>No past trips.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default TripList
