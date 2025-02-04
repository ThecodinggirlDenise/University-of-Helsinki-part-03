const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, "Name is obligatory to write"],
  },
  number: {
    type: String,
    required: [true, "Phone number is obligatory to write"],
    validate: {
      validator: function (Num) {
        return /^\d{2,3}-\d+$/.test(Num); // Format validation: XX-XXXXX or XXX-XXXXX
      },
      message: (props) => `${props.value} is not a OK phone number!`,
    },
    minlength: 8,
  },
});

module.exports = mongoose.model("Person", PersonSchema);
