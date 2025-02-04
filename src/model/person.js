const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, "Name is required"],
  },
  number: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: function (num) {
        return /^\d{2,3}-\d+$/.test(num); // Format validation: XX-XXXXX or XXX-XXXXX
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    minlength: 8,
  },
});

module.exports = mongoose.model("Person", personSchema);
