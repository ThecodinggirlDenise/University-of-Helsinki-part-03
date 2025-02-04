require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const personsRouter = require("./controllers/persons");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(morgan("tiny"));

app.use("/api/persons", personsRouter);

app.use((req, res) => {
  res.status(404).send({ error: "Unknown ENDPOINT" });
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
