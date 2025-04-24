const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const connectDB = require('./routes/connection')

(async () => { 
    try {
        await connectDB();
        console.log('✅ MongoDB connected...');
        await seedDatabase();
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
    }
})
// try {
//     connectDB().then(async () => {
//         console.log('✅ MongoDB connected...');  
//         await seedDatabase();       
        
//     }).catch(err => {
//         console.error('❌ MongoDB connection failed:', err);
//     });
// } catch (error) {
//     console.error('Error connecting to MongoDB:', error.message);      
// }

async function seedDatabase() {
  try {
    // await connectDB();
    console.log('🔄 Clearing existing data...');
    await Booking.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});


    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password123', salt);

    console.log('🔐 Sample hashed password:', hashedPassword);
    console.log('📌 Use password: "password123" to login for all test users');

    const users = await User.insertMany([
      {
        firstName: "Denny",
        lastName: "Johnson",
        email: "denny@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/denny.jpeg"
      },
      {
        firstName: "John",
        lastName: "Smith",
        email: "bob@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/JohnSmiths.jpg"
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: "clara@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/johndoeImage.jpeg"
      }
    ]);

    const listings = await Listing.insertMany([
      {
        creator: users[0]._id,
        category: "Beachfront",
        type: "Entire Home",
        streetAddress: "101 Ocean Drive",
        aptSuite: "Apt 1",
        city: "Miami",
        state: "FL",
        country: "USA",
        guestCount: 4,
        bedroomCount: 2,
        bedCount: 2,
        bathroomCount: 2,
        amenities: ["WiFi", "Kitchen", "Washer"],
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
        title: "Beach Paradise",
        description: "Beautiful beachfront stay.",
        highlight: "Oceanfront",
        highlightDesc: "Waves at your doorstep.",
        price: 180
      },
      {
        creator: users[1]._id,
        category: "Countryside",
        type: "Entire Home",
        streetAddress: "505 Farm Rd",
        aptSuite: "House 9",
        city: "Lexington",
        state: "KY",
        country: "USA",
        guestCount: 7,
        bedroomCount: 4,
        bedCount: 5,
        bathroomCount: 3,
        amenities: ["Firepit", "Farm Access"],
        listingPhotoPaths: [
          "/uploads/Listing2/windmills_1.jpg",
          "/uploads/Listing2/windmills_2.jpg",
          "/uploads/Listing2/windmills_3.jpg",
          "/uploads/Listing2/windmills_4.jpg",
          "/uploads/Listing2/windmills_5.jpg",
          "/uploads/Listing2/windmills_6.jpg"
        ],
        title: "Rustic Farmhouse",
        description: "Peaceful country home.",
        highlight: "Family Friendly",
        highlightDesc: "Bring the kids and pets!",
        price: 160
      },
      {
        creator: users[0]._id,
        category: "City",
        type: "Private Room",
        streetAddress: "303 Main St",
        aptSuite: "Room 2B",
        city: "New York",
        state: "NY",
        country: "USA",
        guestCount: 2,
        bedroomCount: 1,
        bedCount: 1,
        bathroomCount: 1,
        amenities: ["WiFi", "TV"],
        listingPhotoPaths: [
          "/uploads/Listing3/2.jpg",
          "/uploads/Listing3/3.jpg",
          "/uploads/Listing3/4.jpg",
          "/uploads/Listing3/4.jpg",
        ],
        title: "Cozy NYC Room",
        description: "Perfect spot in Manhattan.",
        highlight: "Central Location",
        highlightDesc: "Close to Times Square.",
        price: 120
      },
      {
        creator: users[1]._id,
        category: "Luxury",
        type: "Entire Home",
        streetAddress: "404 Sunset Blvd",
        aptSuite: "Suite 5",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        guestCount: 5,
        bedroomCount: 3,
        bedCount: 3,
        bathroomCount: 3,
        amenities: ["Pool", "WiFi", "Parking"],
        listingPhotoPaths: [
          "/uploads/Listing4/condo-1.jpeg",
          "/uploads/Listing4/condo-2.jpeg",
          "/uploads/Listing4/condo-3.jpeg",
          "/uploads/Listing4/condo-4.jpeg",
          "/uploads/Listing4/condo-5.jpeg",
          "/uploads/Listing4/condo-6.jpeg",
          "/uploads/Listing4/condo-7.jpeg"
        ],
        title: "Hollywood Villa",
        description: "Live like a celebrity.",
        highlight: "Luxury Stay",
        highlightDesc: "Glamorous experience.",
        price: 300
      },
      {
        creator: users[2]._id,
        category: "Cabin",
        type: "Entire Home",
        streetAddress: "202 Forest Rd",
        aptSuite: "Cabin A",
        city: "Asheville",
        state: "NC",
        country: "USA",
        guestCount: 6,
        bedroomCount: 3,
        bedCount: 4,
        bathroomCount: 2,
        amenities: ["Fireplace", "Hiking", "WiFi"],
        listingPhotoPaths: [
          "/uploads/Listing5/condo-1.jpeg",
          "/uploads/Listing5/condo-2.jpeg",
          "/uploads/Listing5/condo-3.jpeg",
          "/uploads/Listing5/condo-4.jpeg",
          "/uploads/Listing5/condo-5.jpeg",
          "/uploads/Listing5/condo-6.jpeg",
          "/uploads/Listing5/condo-7.jpeg"
        ],
        title: "Forest Escape",
        description: "Secluded log cabin.",
        highlight: "Nature Retreat",
        highlightDesc: "Escape the city life.",
        price: 140
      },
    ]);

    const bookings = [];
    for (let i = 0; i < 5; i++) {
      const start = new Date();
      start.setDate(start.getDate() - (30 + i * 3));
      const end = new Date();
      end.setDate(start.getDate() + 2);

      bookings.push({
        customerId: users[i % users.length]._id,
        hostId: listings[i].creator,
        listingId: listings[i]._id,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        totalPrice: listings[i].price * 2
      });
    }

    await Booking.insertMany(bookings);

    console.log("✅ Database seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase()
process.exit()