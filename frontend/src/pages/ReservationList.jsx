import React from 'react'
import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom";

const ReservationList = () => {
  // Local loading state
  const [loading, setLoading] = useState(true);

  // Get user and reservation list from Redux store
  const user = useSelector((state) => state.user);
  const userId = user?._id;

  // Initialize local state for separated reservations
  const [currentReservations, setCurrentReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Fetch current and past reservations from the backend
  const getReservations = async () => {
    try {
      // Make two concurrent fetch requests
      const [currentRes, pastRes] = await Promise.all([
        fetch(`http://localhost:3001/users/${userId}/reservations/current`),
        fetch(`http://localhost:3001/users/${userId}/reservations/past`)
      ]);

      // Convert responses to JSON
      const currentData = await currentRes.json();
      const pastData = await pastRes.json();

      // Update state with received data
      setCurrentReservations(currentData);
      setPastReservations(pastData);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation Lists failed!", err.message);
    }
  };

  // Fetch data only once the userId becomes available
  useEffect(() => {
    if (userId) {
      getReservations();
    }
  }, [userId]);

  // If data is still loading, show a loading spinner
  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <div className="reservation-list-container">
        {/* Section for upcoming reservations */}
        <h2 className="section-title">Current Reservations</h2>
        <div className="list">
          {currentReservations?.map(
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
                booking={true} // Marks this as a booked listing
              />
            )
          )}
        </div>

        {/* Section for past reservations */}
        <h2 className="section-title">Past Reservations</h2>
        <div className="list">
          {pastReservations?.map(
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
                booking={true} // Marks this as a booked listing
              />
            )
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReservationList;
