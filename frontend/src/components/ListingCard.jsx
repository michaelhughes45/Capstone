import React, { useState } from "react";
import "../styles/ListingCard.scss";
import { ArrowForwardIos, ArrowBackIosNew, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";

// Reusable listing card component displaying property details, images, and interactions
const ListingCard = ({
  bookingId,
  listingId,
  creator,
  listingPhotoPaths,
  city,
  state,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
  showDelete = false, // Optional prop to show delete button (used only on PropertyList page)
}) => {
  // Index for image slider
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slide to previous image
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  // Slide to next image
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  // Check if listing is already in wishlist
  const isLiked = wishList?.find((item) => item?._id === listingId);

  // Add or remove listing from wishlist
  const patchWishList = async () => {
    if (user?._id !== creator._id) {
      const response = await fetch(
        `http://localhost:3001/users/${user?._id}/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setWishList(data.wishList));
    }
  };

  // Cancel a booking (only if this is a trip card)
  const handleCancelBooking = async () => {
    try {
      const res = await fetch(`http://localhost:3001/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Booking canceled successfully");
        window.location.reload(); // Refresh page after cancellation
      } else {
        const error = await res.json();
        alert(`Cancel failed: ${error.message}`);
      }
    } catch (err) {
      console.error("Cancel booking error", err.message);
    }
  };

  // Delete listing with confirmation dialog
  const handleDeleteListing = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/listings/${listingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Listing deleted successfully");
        window.location.reload(); // Refresh to reflect deletion
      } else {
        const error = await res.json();
        alert(`Delete failed: ${error.message}`);
      }
    } catch (err) {
      console.error("Delete listing error", err.message);
    }
  };

  return (
    <div
      className="listing-card"
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      {/* Image slider */}
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`http://localhost:3001/${photo?.replace("public", "")}`}
                alt={`photo ${index + 1}`}
              />
              {/* Previous button */}
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide();
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>

              {/* Next button */}
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide();
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listing location and category */}
      <h3>{city}, {state}, {country}</h3>
      <p>{category}</p>

      {/* Conditionally show booking or price info */}
      {!booking ? (
        <>
          <p>{type}</p>
          <p><span>${price}</span> per night</p>
        </>
      ) : (
        <>
          <p>{startDate} - {endDate}</p>
          <p><span>${totalPrice}</span> total</p>
        </>
      )}

      {/* Wishlist heart button */}
      <button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>

      {/* Cancel booking button (for trips) */}
      {booking && (
        <button
          className="cancel-booking"
          onClick={(e) => {
            e.stopPropagation();
            handleCancelBooking();
          }}
        >
          Cancel Booking
        </button>
      )}

      {/* Delete listing button (only shown if showDelete is true) */}
      {showDelete && (
        <button
          className="cancel-booking"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteListing();
          }}
        >
          Delete Listing
        </button>
      )}
    </div>
  );
};

export default ListingCard;
