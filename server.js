const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/users", (req, res) => {
  res.send(`req.body`);
});

app.post("/users", (req, res) => {
  console.log(req.body);
  res.send(`req.body`);
});

app.listen(port, () => {
  console.log(`Application running at ${port}`);
});
