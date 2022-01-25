const mongoose = require("mongoose");

if (process.argv.length < 5) {
  console.log(
    "Please fill phonebook as an argument: node mongo.js <password> <name> <phone>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGO_URI;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: Number(process.argv[4]),
});

person.save().then((result) => {
  console.log("person saved");
  mongoose.connection.close();
});

// Person.find({}).then((result) => {
//   result.forEach((person) => {
//     console.log(person);
//   });
//   mongoose.connection.close();
// });
