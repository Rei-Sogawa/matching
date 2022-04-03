import "./firebase-app";

import express from "express";

import { getDb } from "./firebase-app";

const app = express();

app.get("/", async (req, res) => {
  const name = process.env.NAME || "World";
  await getDb().collection("users").add({ createdAt: new Date().toString() });
  res.send(`Hello Fucking ${name}!.`);
});

// NOTE: use port 3000 when local development, because firebase emulator firestore use port 8080
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
