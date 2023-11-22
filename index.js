const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

const db = mysql.createConnection({
  host: "localhost",
  user: "Tarun",
  password: "Tarun2310#",
  database: "omdb_favourites",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/search", async (req, res) => {
  const inputValue = req.body.searchInput;
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?s=${inputValue}&apikey=51e0455b`
    );
    const movies = response.data.Search;
    res.render("searchResults", { movies });
  } catch (error) {
    console.error("Error fetching data from OMDB API:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/favorites", (req, res) => {
  db.query("SELECT * FROM favorites", (err, results) => {
    if (err) throw err;
    res.render("favorites", { favorites: results });
  });
});

app.post("/save-favorite", (req, res) => {
  const { title, year, type, poster } = req.body;
  db.query(
    "INSERT INTO favorites (title, year, type, poster) VALUES (?, ?, ?, ?)",
    [title, year, type, poster],
    (err, result) => {
      if (err) throw err;
      res.status(200).send("Favorite saved successfully");
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
