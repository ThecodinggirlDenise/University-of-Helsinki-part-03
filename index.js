const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

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

// Hardcoded persons list
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

// Route to get all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
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

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
