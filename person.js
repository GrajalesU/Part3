require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

console.log(`Connecting to ${uri}`);

mongoose
  .connect(uri)
  .then((_) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
