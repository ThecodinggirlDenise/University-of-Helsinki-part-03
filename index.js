require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔍 Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop the server if DB connection fails
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

// 🚀 **GET /api/persons - Fetch from MongoDB**
app.get("/api/persons", async (req, res) => {
  try {
    console.log("🔍 Fetching persons from MongoDB...");
    const persons = await Person.find({});
    console.log("✅ Persons fetched:", persons);
    res.json(persons);
  } catch (error) {
    console.error("❌ Database fetch error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// Middleware
app.use(express.json()); // Parses JSON body
app.use(cors()); // Enables CORS
app.use(morgan("tiny")); // Logs requests

// Custom Morgan logging to log POST body
morgan.token("post-body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-body"
  )
);

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find({}); // ✅ Fetch from MongoDB
    res.json(persons);
  } catch (error) {
    console.error("❌ Error fetching from MongoDB:", error);
    res.status(500).json({ error: "Database error" });
  }
});
app.get("/api/persons/:id", async (req, res) => {
  try {
    console.log("🔍 Searching for ID:", req.params.id); // Debugging

    const person = await Person.findById(req.params.id);

    if (!person) {
      console.log("❌ Person not found in DB:", req.params.id);
      return res.status(404).json({ error: "Person not found" });
    }

    res.json(person);
  } catch (error) {
    console.error("❌ Invalid MongoDB ID format:", error.message);
    res.status(400).json({ error: "Invalid ID format" });
  }
});
// Info page
app.get("/info", (req, res) => {
  const time = new Date();
  res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${time}</p>
  `);
});

// Get a single person by ID
app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }
  res.json(person);
});

// Delete a person by ID
app.delete("/api/persons/:id", (req, res) => {
  const idToDelete = req.params.id;
  const personExists = persons.some((p) => p.id === idToDelete);

  if (!personExists) {
    return res.status(404).json({ error: "Person not found" });
  }

  persons = persons.filter((p) => p.id !== idToDelete);
  res.status(204).end();
});

// Add a new person (Fixes for 400 Error)
app.post("/api/persons", (req, res) => {
  console.log("📥 Received request data:", req.body);

  const { name, number } = req.body;

  if (!name || !number) {
    console.log("❌ Missing name or number!");
    return res.status(400).json({ error: "Name or number missing" });
  }
  if (persons.some((p) => p.name === name)) {
    console.log("❌ Name already exists!");
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    id: String(Math.floor(Math.random() * 10000)), // Random ID
    name,
    number,
  };

  persons.push(newPerson);
  console.log("✅ Person added:", newPerson);
  res.json(newPerson);
});

// Middleware to handle unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
});
