import express from "express";
import countries from "./data/countries.json";

const app = express();
const port = 8081;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/all", async (req, res) => res.status(200).send(countries));

// return 404 if no route is matched
app.all("*", (req, res) => res.sendStatus(404));

try {
  app.listen(port, (): void => {
    console.log(`server running on port ${port}`);
  });
} catch (e) {
  console.error(e);
}
