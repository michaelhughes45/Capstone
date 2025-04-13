const router = require("express").Router()

const Booking = require("../models/Booking")
const User = require("../models/User")
const Listing = require("../models/Listing")

/* GET TRIP LIST */
router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params
    const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId")
    res.status(202).json(trips)
  } catch (err) {
    // console.log(err)
    res.status(404).json({ message: "Can not find trips!", error: err.message })
  }
})

/* GET CURRENT TRIPS */
router.get("/:userId/trips/current", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();

    const currentTrips = await Booking.find({
      customerId: userId,
    }).populate("customerId hostId listingId");

    const filteredTrips = currentTrips.filter((trip) => {
      return new Date(trip.endDate) >= today;
    });

    res.status(200).json(filteredTrips);
  } catch (err) {
    // console.log(err);
    res.status(404).json({ message: "Cannot find current trips", error: err.message });
  }
});

/* GET PAST TRIPS */
router.get("/:userId/trips/past", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();

    const pastTrips = await Booking.find({
      customerId: userId,
    }).populate("customerId hostId listingId");

    const filteredTrips = pastTrips.filter((trip) => {
      return new Date(trip.endDate) < today;
    });

    res.status(200).json(filteredTrips);
  } catch (err) {
    // console.log(err);
    res.status(404).json({ message: "Cannot find past trips", error: err.message });
  }
});

/* ADD LISTING TO WISHLIST */
router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params
    const user = await User.findById(userId)
    const listing = await Listing.findById(listingId).populate("creator")

    const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId)

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId)
      await user.save()
      res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList})
    } else {
      user.wishList.push(listing)
      await user.save()
      res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList})
    }
  } catch (err) {
    // console.log(err)
    res.status(404).json({ error: err.message })
  }
})

/* GET PROPERTY LIST */
router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params
    const properties = await Listing.find({ creator: userId }).populate("creator")
    res.status(202).json(properties)
  } catch (err) {
    // console.log(err)
    res.status(404).json({ message: "Can not find properties!", error: err.message })
  }
})

/* GET RESERVATION LIST */
router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params
    const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId")
    res.status(202).json(reservations)
  } catch (err) {
    // console.log(err)
    res.status(404).json({ message: "Can not find reservations!", error: err.message })
  }
})

/* GET CURRENT RESERVATIONS */
router.get("/:userId/reservations/current", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();

    const allReservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId");

    const currentReservations = allReservations.filter((booking) => {
      const endDate = new Date(booking.endDate);
      return endDate >= today;
    });

    res.status(200).json(currentReservations);
  } catch (err) {
    // console.log(err);
    res.status(404).json({ message: "Cannot find current reservations", error: err.message });
  }
});

/* GET PAST RESERVATIONS */
router.get("/:userId/reservations/past", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();

    const allReservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId");

    const pastReservations = allReservations.filter((booking) => {
      const endDate = new Date(booking.endDate);
      return endDate < today;
    });

    res.status(200).json(pastReservations);
  } catch (err) {
    // console.log(err);
    res.status(404).json({ message: "Cannot find past reservations", error: err.message });
  }
});
module.exports = router