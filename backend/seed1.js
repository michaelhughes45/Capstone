// I used test snipits from chatgpt
require("dotenv").config();
const mongoose = require("mongoose");

const Person = require("./models/person");
const Unit = require("./models/unit");
const Activity = require("./models/activity");
const Picture = require("./models/picture");
const Review = require("./models/review");
const Stay = require("./models/stay");

const { ObjectId } = mongoose.Types;

// Generate ObjectIds up front
const personIds = Array.from({ length: 5 }, () => new ObjectId());
const unitIds = Array.from({ length: 5 }, () => new ObjectId());

// Step 1: Create People
const persons = [
  {
    _id: personIds[0],
    name: "Alice Owner",
    username: "alice123",
    password: "alicepass",
    type: "owner",
    unitsOwned: [unitIds[0], unitIds[1]],
    unitsStayedIn: []
  },
  {
    _id: personIds[1],
    name: "Bob Guest",
    username: "bobg",
    password: "bobpass",
    type: "guest",
    unitsOwned: [],
    unitsStayedIn: [unitIds[2], unitIds[3]]
  },
  {
    _id: personIds[2],
    name: "Carol Owner",
    username: "carol456",
    password: "carolpass",
    type: "owner",
    unitsOwned: [unitIds[2]],
    unitsStayedIn: []
  },
  {
    _id: personIds[3],
    name: "Dan Guest",
    username: "dan789",
    password: "danpass",
    type: "guest",
    unitsOwned: [],
    unitsStayedIn: [unitIds[0], unitIds[4]]
  },
  {
    _id: personIds[4],
    name: "Eve Owner",
    username: "eveowner",
    password: "evepass",
    type: "owner",
    unitsOwned: [unitIds[3], unitIds[4]],
    unitsStayedIn: []
  }
];

// Step 2: Create Units
const units = unitIds.map((id, i) => {
  const owner = persons.find(p => p.unitsOwned.includes(id));
  return {
    _id: id,
    ownerId: owner._id,
    address: `${100 + i} Main St`,
    unitNumber: `${i + 1}A`,
    numberBedrooms: 2 + i,
    datesOccupied: [`2025-04-${10 + i}`],
    sleeps: 2 + i,
    price: 100 + i * 50,
    rating: 4.0 + 0.1 * i,
    shortDescription: `Short desc ${i}`,
    description: `Full description of unit ${i}`,
    amenities: ["wifi", "pool", "kitchen"]
  };
});

// Step 3: Activities
const activities = Array.from({ length: 5 }, (_, i) => ({
  name: `Activity ${i + 1}`,
  type: i % 2 === 0 ? "Outdoor" : "Indoor",
  description: `Description for activity ${i + 1}`,
  location: `Location ${i + 1}`,
  dateStart: `2025-04-${10 + i}`,
  dateEnd: `2025-04-${11 + i}`,
  hoursOpen: "08:00 - 17:00"
}));

// Step 4: Pictures
const pictures = unitIds.map((id, i) => ({
  unitId: id,
  pictureUrl: `https://example.com/image${i + 1}.jpg`,
  displayOrder: i + 1
}));

// Step 5: Reviews
const reviews = unitIds.map((unitId, i) => {
  const reviewer = persons[i % persons.length];
  return {
    unitId,
    name: reviewer.name,
    nameId: reviewer._id,
    reviewText: `Great stay at unit ${i}`,
    rating: 4 + (i % 2),
    verified: true
  };
});

// Step 6: Stays
const stays = unitIds.map((unitId, i) => {
  const guest = persons.find(p => p.type === "guest");
  const owner = units[i].ownerId;
  return {
    personId: guest._id,
    ownerId,
    unitId,
    startDate: `2025-04-${10 + i}`,
    endDate: `2025-04-${11 + i}`,
    dates: [`2025-04-${10 + i}`],
    paymentStatus: "paid",
    status: "confirmed"
  };
});

// Seed Function
async function seedDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Clear collections
    await Promise.all([
      Person.deleteMany(),
      Unit.deleteMany(),
      Activity.deleteMany(),
      Picture.deleteMany(),
      Review.deleteMany(),
      Stay.deleteMany()
    ]);
    console.log("🧹 Cleared existing data");

    // Insert new data
    await Person.insertMany(persons);
    await Unit.insertMany(units);
    await Activity.insertMany(activities);
    await Picture.insertMany(pictures);
    await Review.insertMany(reviews);
    await Stay.insertMany(stays);

    console.log("🌱 Database seeded with 5 entries per collection!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();