// Importing necessary libraries, components, and styles
import React from 'react';
import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss"; // Importing styles for the page
import { useNavigate, useParams } from "react-router-dom"; // React Router hooks for navigation and URL parameters
import { facilities } from "../data.jsx"; // Data for facilities

// Importing date-related libraries and styles
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range"; // Date range picker component
import { enUS } from 'date-fns/locale'; // Locale for the date picker
import { addDays, eachDayOfInterval } from 'date-fns'; // Utility functions for date manipulation

// Importing custom components
import Loader from "../components/Loader"; // Loader component for loading state
import Navbar from "../components/Navbar"; // Navbar component
import { useSelector } from "react-redux"; // Redux hook for accessing state
import Footer from "../components/Footer"; // Footer component

// Main component for displaying listing details
const ListingDetails = () => {
  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // Extracting the listing ID from the URL parameters
  const { listingId } = useParams();

  // State for storing listing details and disabled dates
  const [listing, setListing] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);

  // Function to fetch listing details from the server
  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/${listingId}`, // API endpoint for fetching listing details
        {
          method: "GET",
        }
      );

      const data = await response.json(); // Parse the response JSON
      setListing(data); // Update the listing state
      setLoading(false); // Set loading to false
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message); // Log any errors
    }
  };

  // Function to fetch disabled dates for the listing
  const fetchDisabledDates = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/bookings/listing/${listingId}`, // API endpoint for fetching bookings
        {
          method: "GET",
        }
      );

      const data = await response.json(); // Parse the response JSON

      // Generate an array of all disabled dates from bookings
      const allDisabled = data.flatMap((booking) => {
        try {
          const start = new Date(booking.startDate);
          const end = new Date(booking.endDate);

          if (isNaN(start) || isNaN(end)) {
            console.warn("Invalid booking date:", booking); // Warn if dates are invalid
            return [];
          }

          return eachDayOfInterval({ start, end }); // Generate all dates in the interval
        } catch (error) {
          console.warn("Skipping invalid booking:", booking); // Warn if booking is invalid
          return [];
        }
      });

      setDisabledDates(allDisabled); // Update the disabled dates state
    } catch (err) {
      console.log("Fetch Disabled Dates Failed", err.message); // Log any errors
    }
  };

  // useEffect to fetch listing details and disabled dates on component mount
  useEffect(() => {
    getListingDetails();
    fetchDisabledDates();
  }, []);

  /* BOOKING CALENDAR */
  // State for the selected date range
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(), // Default start date is today
      endDate: new Date(), // Default end date is today
      key: "selection", // Key for the date range picker
    },
  ]);

  // Handler for updating the selected date range
  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]); // Update the date range state
  };

  // Calculate the number of days between the selected start and end dates
  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

  /* SUBMIT BOOKING */
  // Get the logged-in user's ID from the Redux store
  const customerId = useSelector((state) => state?.user?._id);

  // Hook for navigation
  const navigate = useNavigate();

  // Function to handle booking submission
  const handleSubmit = async () => {
    try {
      // Create a booking form object
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id, // Host ID from the listing details
        startDate: dateRange[0].startDate.toDateString(), // Convert start date to string
        endDate: dateRange[0].endDate.toDateString(), // Convert end date to string
        totalPrice: listing.price * dayCount, // Calculate total price
      };

      // Send a POST request to create a booking
      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm), // Send the booking form as JSON
      });

      if (response.ok) {
        navigate(`/${customerId}/trips`); // Redirect to the user's trips page
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message); // Log any errors
    }
  };

  // Render the component
  return loading ? (
    <Loader /> // Show loader while loading
  ) : (
    <>
      <Navbar /> {/* Navbar component */}

      <div className="listing-details">
        {/* Title and photos */}
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item) => (
            <img
              key={item} // Unique key for each image
              src={`http://localhost:3001/${item.replace("public", "")}`} // Display listing photos
              alt="listing photo"
            />
          ))}
        </div>

        {/* Listing details */}
        <h2>
          {listing.type} in {listing.city}, {listing.state},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        {/* Host profile */}
        <div className="profile">
          <img
            src={`http://localhost:3001/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`} // Display host profile image
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />

        {/* Description and highlights */}
        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        {/* Booking section */}
        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon // Display facility icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange
                locale={enUS} // Set locale for the date picker
                ranges={dateRange} // Pass the selected date range
                minDate={new Date()} // Disable past dates
                disabledDates={disabledDates} // Pass disabled dates
                onChange={handleSelect} // Handle date selection
              />
              {dayCount > 1 ? (
                <h2>
                  ${listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button className="button" type="submit" onClick={handleSubmit}>
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;