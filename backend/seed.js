const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const connectDB = require('./routes/connection')

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
        firstName: "John",
        lastName: "Smith",
        email: "johnsmith@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/JohnSmiths.jpg"
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/johndoeImage.jpeg"
      },
      {
        firstName: "Denny",
        lastName: "Johnson",
        email: "dennyjohnson@example.com",
        password: hashedPassword,
        profileImagePath: "/uploads/denny.jpeg"
      }
    ]);

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
        description: "Escape to your own private sanctuary at this stunning island retreat, where golden sands meet turquoise waters. This luxurious beachfront villa offers open-concept living with panoramic ocean views, stylish modern interiors, a gourmet kitchen, and expansive outdoor spaces designed for pure relaxation. Whether you're basking in the sun by the infinity pool, enjoying a sunset dinner on the terrace, or relaxing indoors with serene coastal decor, every moment here feels like a dream. Perfect for family vacations, romantic getaways, or unforgettable group adventures.",
        highlight: "Unmatched Beachfront Luxury",
        highlightDesc: "Experience true island living with exclusive beachfront access just steps from your door. Spend your days lounging by the sparkling pool, dining al fresco with endless sea views, and falling asleep to the sound of the waves — all within your private tropical paradise.",
        price: 1100
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
        description: "Step into a storybook escape at this one-of-a-kind windmill home in Lexington, Kentucky. Nestled amid lush gardens and open fields, this enchanting property combines rustic charm with modern comfort. Inside, discover original wooden beams, cozy bedrooms, a fully equipped kitchen, and a spiral staircase leading up to the heart of the windmill. Outside, relax on the spacious patio surrounded by beautiful landscaping, or explore the peaceful countryside views. Perfect for families or groups seeking a unique and memorable getaway.",
        highlight: "Unforgettable Setting",
        highlightDesc: "Wake up to sweeping meadow views, dine beneath spinning sails, and experience a true countryside getaway unlike any other — the perfect backdrop for family vacations, romantic retreats, and relaxing escapes.",
        price: 500
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
        description: "Escape to nature and unwind in this stunning countryside retreat. This warm and inviting log-style cabin features soaring wood beam ceilings, panoramic forest views, cozy fireplaces, and rustic-chic decor throughout. Whether you're curled up by the fire, lounging on the spacious deck, or exploring the peaceful woods outside your door, every moment here promises tranquility and connection with nature. Perfect for couples, families, or small groups seeking a secluded and stylish getaway.",
        highlight: "Nature Lover’s Paradise",
        highlightDesc: "Surrounded by towering pines and endless views, this cozy retreat lets you slow down, breathe deep, and experience the beauty of the outdoors — right from your doorstep.",
        price: 400
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
        description: "Wake up to breathtaking ocean sunrises and fall asleep to the sound of waves at this stunning beachfront condo. Spacious and full of natural light, this coastal retreat features a bright, airy design, floor-to-ceiling windows, a modern chef’s kitchen, and private balcony seating for soaking in endless sea views. Whether you're enjoying family dinners, relaxing by the beach, or exploring local attractions, every moment here feels like a dream come true. Perfect for families, couples, and groups seeking comfort and unbeatable location.",
        highlight: "Steps from the Sand",
        highlightDesc: "Start each day with the beach right outside your door — whether you're sipping coffee on the balcony, strolling the shore at sunset, or taking a swim, the ocean is always just a few steps away.",
        price: 900
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
        description: "Sunshine, sea breezes, and stunning coastal views await at this beautifully updated beachfront condo. Perfect for families or groups, this spacious retreat features stylish beachy decor, multiple bedrooms with plenty of sleeping space, two luxurious bathrooms, and an open-concept living area that flows onto a private balcony overlooking sugar-white sands and turquoise waters. Whether you're sipping your morning coffee on the deck or unwinding after a day at the beach, this inviting space offers comfort, style, and unforgettable memories.",
        highlight: "Spacious Comfort by the Sea",
        highlightDesc: "With large bedrooms, roomy living spaces, and a breezy private balcony, this coastal condo is perfect for family vacations, girls trips, and anyone who loves having the beach just outside their door.",
        price: 900
      }
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

module.exports = seedDatabase;