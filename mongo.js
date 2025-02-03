require("dotenv").config();
const mongoose = require("mongoose");

// Get MongoDB URI from .env file
const url = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");

    // Command-line arguments
    const args = process.argv;

    // Define the schema
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    // Define the model (Collection will be named `people`)
    const Person = mongoose.model("Person", personSchema);

    if (args.length === 3) {
      // If only the password is provided → List all contacts
      Person.find({}).then((result) => {
        console.log("Phonebook:");
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      });
    } else if (args.length === 5) {
      // If name and number are provided → Add a new contact
      const person = new Person({
        name: args[3],
        number: args[4],
      });

      person.save().then(() => {
        console.log(`Added ${args[3]} number ${args[4]} to phonebook`);
        mongoose.connection.close();
      });
    } else {
      console.log("Usage:");
      console.log(
        "  node mongo.js yourpassword            # List all contacts"
      );
      console.log(
        "  node mongo.js yourpassword Name Number # Add a new contact"
      );
      mongoose.connection.close();
    }
  })
  .catch((err) => console.log("Error:", err));
