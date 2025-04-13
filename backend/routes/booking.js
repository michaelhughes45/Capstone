const router = require("express").Router()

const Booking = require("../models/Booking")

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

    if (!customerId || !hostId || !listingId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: "Fail to create a new Booking!" });
    }

    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice });
    await newBooking.save();
    res.status(200).json(newBooking);
  } catch (err) {
    // console.log(err);
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message });
  }
});

/* GET BOOKINGS BY LISTING ID */
router.get('/listing/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const bookings = await Booking.find({ listingId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this listing" });
    }

    res.status(200).json(bookings);
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Failed to retrieve bookings", error: err.message });
  }
});

router.delete("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    // console.error("Delete booking error:", err);
    res.status(500).json({ message: "Failed to cancel booking", error: err.message });
  }
});



module.exports = router