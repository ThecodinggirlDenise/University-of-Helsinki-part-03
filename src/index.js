require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const personsRouter = require("./controllers/persons");
const app = express();

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Allow frontend to access backend
app.use(express.static("build")); // Serve frontend
app.use(morgan("tiny"));

// Routes
app.use("/api/persons", personsRouter);

// Middleware for unknown routes
app.use((req, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
});

// Global error handler
app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
