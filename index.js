require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./person");

const app = express();

morgan.token("content", (req) => {
  const body = req.body;
  if (Object.keys(body).length === 0) {
    return null;
  }
  return JSON.stringify(body);
});

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError")
    return res.status(400).send({ error: "malformatted id" });
  if (error.name === "ValidationError")
    return res.status(400).json({ error: error.message });
  next(error);
};

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :content")
);
app.use(express.static("build"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).json({
      error: "content missing",
    });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      console.log(savedPerson);
      return savedPerson.toJSON();
    })
    .then((savedAndFormattedPerson) => {
      console.log(savedAndFormattedPerson);
      res.json(savedAndFormattedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.content,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//3.1-3.6 took 1 hour
//3.7-3.8 took 30 minutes
//3.9-3.11 took 30 minutes
//3.12 took 30 minutes
//3.13-3.18 took 2 hours
//3.19-3.21 took 1 hour and a half
//3.22 took 30 minutes