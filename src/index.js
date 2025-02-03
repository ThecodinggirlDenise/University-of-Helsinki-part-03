const express = require("express");
const morgan = require("morgan");

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json()); // Middleware to parse JSON request bodies

morgan.token("post-data", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-data"
  )
);
// Serve frontend from backend
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Example phonebook data
let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

// Get all contacts
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// Add a new contact
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name,
    number,
  };

  persons = [...persons, newPerson];

  res.json(newPerson);
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
