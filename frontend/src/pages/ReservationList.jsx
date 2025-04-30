import React, { useEffect, useState } from 'react';
import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

import { setReservationList } from "../redux/state";

const ReservationList = () => {
  // State to control loading while fetching reservation data
  const [loading, setLoading] = useState(true);

  // Access current user and their ID from Redux store
  const user = useSelector((state) => state.user);
  const userId = user?._id;

  // Local state to hold current and past reservations separately
  const [currentReservations, setCurrentReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Fetch current and past reservations from backend API
  const getReservations = async () => {
    try {
      // Send both requests concurrently
      const [currentRes, pastRes] = await Promise.all([
        fetch(`http://localhost:3001/users/${userId}/reservations/current`),
        fetch(`http://localhost:3001/users/${userId}/reservations/past`)
      ]);

      // Parse JSON responses
      const currentData = await currentRes.json();
      const pastData = await pastRes.json();

      // Update local state with fetched reservations
      setCurrentReservations(currentData);
      setPastReservations(pastData);

      // (Optional) Update Redux if needed
      dispatch(setReservationList([...currentData, ...pastData]));

      // Stop showing the loader
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation Lists failed!", err.message);
    }
  };

  // Run fetch once userId is available
  useEffect(() => {
    if (userId) {
      getReservations();
    }
  }, [userId]);

  // Show loader until data is fully fetched
  return loading ? (
    <Loader />
  ) : (
    <>
      {/* Top navigation bar */}
      <Navbar />

      <div className="reservation-list-container">

        {/* --- CURRENT RESERVATIONS --- */}
        <h2 className="section-title">Current Reservations</h2>
        <div className="list">
          {currentReservations?.length > 0 ? (
            // Map each current reservation into a listing card
            currentReservations.map(
              ({ _id: bookingId, listingId, hostId, startDate, endDate, totalPrice }) => (
                <ListingCard
                  key={bookingId}
                  bookingId={bookingId}
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
              )
            )
          ) : (
            // Fallback if no upcoming reservations
            <p>No upcoming reservations.</p>
          )}
        </div>

        {/* --- PAST RESERVATIONS --- */}
        <h2 className="section-title">Past Reservations</h2>
        <div className="list">
          {pastReservations?.length > 0 ? (
            // Map each past reservation into a listing card
            pastReservations.map(
              ({ _id: bookingId, listingId, hostId, startDate, endDate, totalPrice }) => (
                <ListingCard
                  key={bookingId}
                  bookingId={bookingId}
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
              )
            )
          ) : (
            // Fallback if no past reservations
            <p>No past reservations.</p>
          )}
        </div>
      </div>

      {/* Footer with navigation/info */}
      <Footer />
    </>
  );
};

export default ReservationList;
