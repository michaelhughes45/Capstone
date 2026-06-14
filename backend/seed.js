// Import required modules and models
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const connectDB = require('./routes/connection');

// Main function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB (uncomment in production use)
    // await connectDB();

    // Clear existing data to prevent duplicates or conflicts
    console.log('🔄 Clearing existing data...');
    await Booking.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});

    // Generate and hash a shared password for all users
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password123', salt);
    console.log('🔐 Sample hashed password:', hashedPassword);
    console.log('📌 Use password: "password123" to login for all test users');

    // Insert sample users
    const users = await User.insertMany([
      {
        firstName: "John",
        lastName: "Smith",
        email: "johnsmith@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/JohnSmiths.jpg",
        isSeeded: true
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/johndoeImage.jpeg",
        isSeeded: true
      },
      {
        firstName: "Denny",
        lastName: "Johnson",
        email: "dennyjohnson@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/denny.jpeg",
        isSeeded: true
      }
    ]);

    // Insert sample listings, associated with the users
    const listings = await Listing.insertMany([
      {
        creator: users[0]._id,
        category: "Islands",
        type: "An entire place",
        streetAddress: "101 Ocean Drive",
        aptSuite: "Suite 1",
        city: "Honolulu",
        state: "Hawaii",
        country: "USA",
        guestCount: 4,
        bedroomCount: 2,
        bedCount: 2,
        bathroomCount: 2,
        // Amenities stored as a single comma-separated string inside an array
        amenities: [
          "Wifi,Air Conditioning,Washer,Dryer,Cooking set,Refrigerator,Microwave,Outdoor dining area,Pool,Private patio or Balcony"
        ],
        listingPhotoPaths: [
          "/uploads/Listing1/1.jpg",
          "/uploads/Listing1/2.jpg",
          "/uploads/Listing1/3.jpg",
          "/uploads/Listing1/4.jpg",
          "/uploads/Listing1/5.jpg",
          "/uploads/Listing1/6.jpg",
          "/uploads/Listing1/7.jpg",
          "/uploads/Listing1/8.jpg"
        ],
        title: "Tropical Island Oasis: Private Beachfront Paradise",
        description: "Escape to your own private sanctuary at this stunning island retreat...",
        highlight: "Unmatched Beachfront Luxury",
        highlightDesc: "Experience true island living with exclusive beachfront access...",
        price: 1100,
        isSeeded: true
      },
      {
        creator: users[0]._id,
        category: "Windmills",
        type: "An entire place",
        streetAddress: "505 Farm Rd",
        aptSuite: "House 3",
        city: "Lexington",
        state: "Kentucky",
        country: "USA",
        guestCount: 7,
        bedroomCount: 4,
        bedCount: 5,
        bathroomCount: 3,
        amenities: [
          "Wifi,TV,Air Conditioning,Washer,Dryer,Cooking set,Refrigerator,Microwave,Dedicated workspace,Self check-in"
        ],
        listingPhotoPaths: [
          "/uploads/Listing2/windmills_1.jpg",
          "/uploads/Listing2/windmills_2.jpg",
          "/uploads/Listing2/windmills_3.jpg",
          "/uploads/Listing2/windmills_4.jpg",
          "/uploads/Listing2/windmills_5.jpg",
          "/uploads/Listing2/windmills_6.jpg"
        ],
        title: "Charming Windmill Retreat with Scenic Views",
        description: "Step into a storybook escape at this one-of-a-kind windmill home...",
        highlight: "Unforgettable Setting",
        highlightDesc: "Wake up to sweeping meadow views, dine beneath spinning sails...",
        price: 500,
        isSeeded: true
      },
      {
        creator: users[1]._id,
        category: "Countryside",
        type: "An entire place",
        streetAddress: "303 N Moose Rd",
        aptSuite: "House 1",
        city: "Breckenridge",
        state: "Colorado",
        country: "USA",
        guestCount: 2,
        bedroomCount: 1,
        bedCount: 1,
        bathroomCount: 1,
        amenities: [
          "Wifi,TV,Air Conditioning,Washer,Dryer,Cooking set,Refrigerator,Microwave,Dedicated workspace,Self check-in"
        ],
        listingPhotoPaths: [
          "/uploads/Listing3/2.jpg",
          "/uploads/Listing3/3.jpg",
          "/uploads/Listing3/4.jpg",
          "/uploads/Listing3/4.jpg"
        ],
        title: "Secluded Countryside Cabin with Wooded Views",
        description: "Escape to nature and unwind in this stunning countryside retreat...",
        highlight: "Nature Lover’s Paradise",
        highlightDesc: "Surrounded by towering pines and endless views...",
        price: 400,
        isSeeded: true
      },
      {
        creator: users[2]._id,
        category: "Beachfront",
        type: "Room(s)",
        streetAddress: "11407 Front Beach Rd",
        aptSuite: "Unit 801",
        city: "Panama City Beach",
        state: "Florida",
        country: "USA",
        guestCount: 5,
        bedroomCount: 3,
        bedCount: 3,
        bathroomCount: 3,
        amenities: [
          "Wifi,Air Conditioning,Pool,Hot tub,Free parking,Security cameras,Barbecue grill,Outdoor dining area,Garden,Private patio or Balcony"
        ],
        listingPhotoPaths: [
          "/uploads/Listing4/condo-1.jpeg",
          "/uploads/Listing4/condo-2.jpeg",
          "/uploads/Listing4/condo-3.jpeg",
          "/uploads/Listing4/condo-4.jpeg",
          "/uploads/Listing4/condo-5.jpeg",
          "/uploads/Listing4/condo-6.jpeg",
          "/uploads/Listing4/condo-7.jpeg"
        ],
        title: "Oceanfront Escape with Panoramic Gulf Views",
        description: "Wake up to breathtaking ocean sunrises and fall asleep to the sound of waves...",
        highlight: "Steps from the Sand",
        highlightDesc: "Start each day with the beach right outside your door...",
        price: 900,
        isSeeded: true
      },
      {
        creator: users[2]._id,
        category: "Beachfront",
        type: "Room(s)",
        streetAddress: "11407 Front Beach Rd",
        aptSuite: "Unit 804",
        city: "Panama City Beach",
        state: "Florida",
        country: "USA",
        guestCount: 6,
        bedroomCount: 3,
        bedCount: 4,
        bathroomCount: 2,
        amenities: [
          "Wifi,Fire extinguisher,Heating,Camp fire,Garden,Outdoor shower,First Aid,Free parking,Cooking set,Washer"
        ],
        listingPhotoPaths: [
          "/uploads/Listing5/condo-1.jpeg",
          "/uploads/Listing5/condo-2.jpeg",
          "/uploads/Listing5/condo-3.jpeg",
          "/uploads/Listing5/condo-4.jpeg",
          "/uploads/Listing5/condo-5.jpeg",
          "/uploads/Listing5/condo-6.jpeg",
          "/uploads/Listing5/condo-7.jpeg"
        ],
        title: "Bright Beach Condo with Endless Gulf Views",
        description: "Sunshine, sea breezes, and stunning coastal views await...",
        highlight: "Spacious Comfort by the Sea",
        highlightDesc: "With large bedrooms, roomy living spaces, and a breezy private balcony...",
        price: 900,
        isSeeded: true
      }
    ]);

    // Generate and insert 5 sample bookings
    const bookings = [];
    for (let i = 0; i < 5; i++) {
      const start = new Date();
      start.setDate(start.getDate() - (30 + i * 3)); // Each booking starts further in the past
      const end = new Date();
      end.setDate(start.getDate() + 2); // Each booking lasts 2 days

      bookings.push({
        customerId: users[i % users.length]._id, // Rotate users
        hostId: listings[i].creator,
        listingId: listings[i]._id,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        totalPrice: listings[i].price * 2,
        isSeeded: true
      });
    }

    await Booking.insertMany(bookings); // Insert all bookings

    console.log("✅ Database seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
  }
}

// Export the seed function
module.exports = seedDatabase;
