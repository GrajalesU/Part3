const express = require("express");
const crypto = require("crypto");
const app = express();

app.use(express.json());

let persons = [
  {
    id: "53d35cc7-6c08-4a25-b1fe-c31d0f12a3eb",
    name: "Carlo",
    number: 300,
  },
  {
    id: "23d41a24-caa2-4f7c-b8d6-ac403b1af229",
    name: "Farina",
    number: 9,
  },
  {
    id: "13692072-71ac-414d-9453-ca37d05664db",
    name: "Me",
    number: 1,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`
    <p> Phonebook has info for ${persons.length} people </p>

    <p> ${Date()} </p>
    `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).json({
      error: "content missing",
    });

  if (persons.some(({ name }) => name === body.name))
    return res.status(404).json({
      error: "name must be unique",
    });
  if (persons.some(({ number }) => number === body.number))
    return res.status(404).json({
      error: "number must be unique",
    });

  const person = body;
  person["id"] = crypto.randomUUID();
  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//3.1-3.6 take 1 hour
