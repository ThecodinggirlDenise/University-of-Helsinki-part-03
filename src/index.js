require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define MongoDB Schema & Model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

// ✅ Logging with Morgan
morgan.token("post-data", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-data"
  )
);

// 🚀 **Get All Contacts (From MongoDB)**
app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// 🚀 **Get a Single Contact**
app.get("/api/persons/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// 🚀 **Add a New Contact**
app.post("/api/persons", async (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }

  try {
    const newPerson = new Person({ name, number });
    const savedPerson = await newPerson.save();
    res.json(savedPerson);
  } catch (error) {
    res.status(500).json({ error: "Failed to save" });
  }
});

// 🚀 **Delete a Contact**
app.delete("/api/persons/:id", async (req, res) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// 🚀 **Update a Contact**
app.put("/api/persons/:id", async (req, res) => {
  const { name, number } = req.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    );
    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(updatedPerson);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// 🚀 **Phonebook Info**
app.get("/info", async (req, res) => {
  const count = await Person.countDocuments({});
  res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
});

// ✅ Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
