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
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const reservationList = useSelector((state) => state.user?.reservationList || []);
  const [currentReservations, setCurrentReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // const getReservationList = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3001/users/${userId}/reservations`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     const data = await response.json();
  //     dispatch(setReservationList(data));
  //     setLoading(false);
  //   } catch (err) {
  //     console.log("Fetch Reservation List failed!", err.message);
  //   }
  // };
  const getReservations = async () => {
    try {
      const [currentRes, pastRes] = await Promise.all([
        fetch(`http://localhost:3001/users/${userId}/reservations/current`),
        fetch(`http://localhost:3001/users/${userId}/reservations/past`)
      ]);

      const currentData = await currentRes.json();
      const pastData = await pastRes.json();

      setCurrentReservations(currentData);
      setPastReservations(pastData);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation Lists failed!", err.message);
    }
  };

  useEffect(() => {
    // getReservationList();
    if (userId) {
      getReservations();
    }
  }, [userId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      {/* <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {reservationList?.map(({_id: bookingId, listingId, hostId, startDate, endDate, totalPrice, booking=true }) => (
          <ListingCard
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
            booking={booking}
          />
        ))}
      </div> */}
      <div className="reservation-list-container">
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
                booking={true}
              />
            )
          )}
        </div>

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
                booking={true}
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