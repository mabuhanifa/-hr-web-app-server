const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.listen(() => {
  console.log(`Application running at ${port}`);
});
