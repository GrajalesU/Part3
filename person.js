require("dotenv").config();
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const uri = process.env.MONGO_URI;

console.log(`Connecting to ${uri}`);

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: {
    type: Number,
    min: 100,
    required: true,
  },
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
