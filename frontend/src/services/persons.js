const express = require("express");
const Person = require("../models/person");
const router = express.Router();
import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => axios.get(baseUrl).then((res) => res.data);
const create = (newObject) =>
  axios.post(baseUrl, newObject).then((res) => res.data);

export default { getAll, create };

// GET all persons
router.get("/", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

// GET person by ID
router.get("/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((error) => next(error));
});

// POST - Add a new person
router.post("/", (req, res, next) => {
  const { name, number } = req.body;

  const person = new Person({ name, number });

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

// PUT - Update a person
router.put("/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

// DELETE - Remove a person
router.delete("/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

module.exports = router;
