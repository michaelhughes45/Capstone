import React from 'react'
import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  // const userId = useSelector((state) => state.user._id);
  const user = useSelector((state) => state.user);
  const userId = user?._id;
  // const tripList = useSelector((state) => state.user.tripList);
  const tripList = user?.tripList || [];
  const [currentTrips, setCurrentTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // const getTripList = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3001/users/${userId}/trips`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     const data = await response.json();
  //     dispatch(setTripList(data));
  //     setLoading(false);
  //   } catch (err) {
  //     console.log("Fetch Trip List failed!", err.message);
  //   }
  // };
  const getTrips = async () => {
    if (!userId) return
    try {
      const [currentRes, pastRes] = await Promise.all([
        fetch(`http://localhost:3001/users/${userId}/trips/current`),
        fetch(`http://localhost:3001/users/${userId}/trips/past`),
      ]);

      const [currentData, pastData] = await Promise.all([
        currentRes.json(),
        pastRes.json(),
      ]);

      const filteredCurrent = currentData.filter((trip) => trip.customerId._id === userId);
      const filteredPast = pastData.filter((trip) => trip.customerId._id === userId);

      setCurrentTrips(filteredCurrent);
      setPastTrips(filteredPast);
      dispatch(setTripList([...filteredCurrent, ...filteredPast]));

      // setCurrentTrips(currentData);
      // setPastTrips(pastData);
      // dispatch(setTripList([...currentData, ...pastData]));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  };

  useEffect(() => {
    // getTripList();
    getTrips()
  }, []);
  // useEffect(() => {
  //   if (userId) {
  //     getTrips();
  //   }
  // }, [userId]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="trip-list-container">
          <h1 className="title-list">You must be logged in to view trips.</h1>
          <Footer />
        </div>
      </>
    );
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      {/* <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.map(({_id: bookingId, listingId, hostId, startDate, endDate, totalPrice, booking=true }) => (
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
      <div className="trip-list-container">
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
  );
};

export default TripList;