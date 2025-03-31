require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Activity = require("./models/activity");
const Person = require("./models/person");
const Picture = require("./models/picture");
const Review = require("./models/review");
const Stay = require("./models/stay");
const Unit = require("./models/unit");

const MONGO_URI = process.env.DB_URL;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🟢 Connected to MongoDB");

    // Clear all collections
    await Promise.all([
      Activity.deleteMany(),
      Person.deleteMany(),
      Picture.deleteMany(),
      Review.deleteMany(),
      Stay.deleteMany(),
      Unit.deleteMany()
    ]);

    // Seed Persons
    // Create Units First
    const units = [];
    for (let i = 0; i < 5; i++) {
    units.push({
        ownerId: null, // we'll assign this after creating persons
        address: faker.location.streetAddress(),
        unitNumber: `${faker.number.int({ min: 1, max: 100 })}`,
        numberBedrooms: faker.number.int({ min: 1, max: 5 }),
        datesOccupied: [faker.date.future().toISOString().split("T")[0]],
        sleeps: faker.number.int({ min: 2, max: 10 }),
        price: faker.number.int({ min: 80, max: 500 }),
        rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
        shortDescription: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        amenities: faker.helpers.arrayElements(["wifi", "hotTub", "pool", "gym", "kitchen"], 3)
    });
    }
    const createdUnits = await Unit.insertMany(units)

    // Create Persons
    const persons = []
    for (let i = 0; i < 5; i++) {
    const type = faker.helpers.arrayElement(["guest", "owner"])
    const isOwner = type === "owner"

    const person = {
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        type: type,
        unitsStayedIn: [],
        unitsOwned: []
    };

    // Assign units to owner or guest
    const relevantUnits = faker.helpers.arrayElements(createdUnits, 2)

    if (isOwner) {
        person.unitsOwned = relevantUnits.map(u => u._id.toString())

        // Also update the units to reflect the ownerId
        for (const unit of relevantUnits) {
        await Unit.findByIdAndUpdate(unit._id, {
            ownerId: person._id
        })
        }
    } else {
        person.unitsStayedIn = relevantUnits.map(u => u._id.toString())
    }

    persons.push(person);
    }
    const createdPersons = await Person.insertMany(persons);

    // Re-assign unit.ownerId values now that persons exist
    for (let person of createdPersons) {
        if (person.type === "owner") {
            for (let unitId of person.unitsOwned) {
            await Unit.findByIdAndUpdate(unitId, { ownerId: person._id.toString() })
            }
        }
    }


    // Seed Activities
    const activities = [];
    for (let i = 0; i < 5; i++) {
      activities.push({
        name: faker.word.words(2),
        type: faker.helpers.arrayElement(["Outdoor", "Indoor", "Relaxation", "Adventure"]),
        description: faker.lorem.paragraph(),
        location: faker.location.city(),
        dateStart: faker.date.future().toISOString(),
        dateEnd: faker.date.future().toISOString(),
        hoursOpen: "09:00 - 17:00"
      });
    }
    await Activity.insertMany(activities)

    // Seed Pictures
    const pictures = [];
    for (let i = 0; i < 5; i++) {
      const unit = faker.helpers.arrayElement(createdUnits);
      pictures.push({
        unitId: unit._id.toString(),
        pictureUrl: faker.image.url(),
        displayOrder: i + 1
      });
    }
    await Picture.insertMany(pictures)

    // Seed Reviews
    const reviews = [];
    for (let i = 0; i < 5; i++) {
      const unit = faker.helpers.arrayElement(createdUnits);
      const reviewer = faker.helpers.arrayElement(createdPersons)
      reviews.push({
        unitId: unit._id.toString(),
        name: reviewer.name,
        nameId: reviewer._id.toString(),
        reviewText: faker.lorem.sentences(2),
        rating: faker.number.int({ min: 3, max: 5 }),
        verified: faker.datatype.boolean()
      })
    }
    await Review.insertMany(reviews)

    // Seed Stays
    const stays = [];
    for (let i = 0; i < 5; i++) {
      const guest = faker.helpers.arrayElement(createdPersons.filter(p => p.type === "guest"))
      const unit = faker.helpers.arrayElement(createdUnits)
      const dates = [faker.date.future().toISOString().split("T")[0]]
      stays.push({
        personId: guest._id.toString(),
        ownerId: unit.ownerId,
        unitId: unit._id.toString(),
        startDate: dates[0],
        endDate: faker.date.future().toISOString().split("T")[0],
        dates: dates,
        paymentStatus: faker.helpers.arrayElement(["paid", "pending"]),
        status: faker.helpers.arrayElement(["confirmed", "cancelled"])
      })
    }
    await Stay.insertMany(stays);

    console.log("🌱 Seed complete with 5 entries per collection")
    process.exit()
  } catch (err) {
    console.error("❌ Error during seeding:", err)
    process.exit(1)
  }
}

seedData()
