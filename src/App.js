import { useState, useEffect } from "react";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch initial data from backend
  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  // Add new person
  const addPerson = (event) => {
    event.preventDefault();

    if (!newName.trim() || !newNumber.trim()) {
      alert("❌ Name and number are required!");
      return;
    }

    const newPerson = { name: newName.trim(), number: newNumber.trim() };

    console.log("📤 Sending to backend:", newPerson);

    personsService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.error(
          "❌ Error adding person:",
          error.response?.data || error.message
        );
        alert(error.response?.data?.error || "An error occurred");
      });
  };

  // Delete person
  const deletePerson = (id) => {
    if (window.confirm("Do you really want to delete this entry?")) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error(
            "❌ Error deleting person:",
            error.response?.data || error.message
          );
          alert("Error deleting person");
        });
    }
  };

  // Filter persons
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        Filter names:{" "}
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <h3>Add a New Contact</h3>
      <form onSubmit={addPerson}>
        <div>
          Name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          Number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
      <h3>Numbers</h3>
      {filteredPersons.map((person) => (
        <p key={person.id}>
          {person.name}: {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </p>
      ))}
    </div>
  );
};

export default App;
