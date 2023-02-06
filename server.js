const express = require("express");
const cors = require("cors");
const pool = require("./db");
const nodemailer = require("nodemailer");
/* ---------------------Express app-------------------- */
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();
const port = 5000;

app.get("/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
    console.log(email);
    const user = await pool.query("SELECT * FROM employee WHERE email = $1", [
      email,
    ]);
    res.status(201).json({
      message: `success`,
      data: user.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { password } = req.body;
    const user = await pool.query("SELECT * FROM employee WHERE email = $1", [
      email,
    ]);

    const isLogin = user.rows[0].password === password;

    if (isLogin) {
      res.status(201).json({
        message: `successfully logged in`,
        data: user.rows[0],
        login: isLogin,
      });
    } else {
      res.status(201).json({
        message: `login failed`,
        login: isLogin,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/signup", async (req, res) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail", // true for 465, false for other ports
    auth: {
      user: "moh.abuhanifa@gmail.com",
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
    port: 465,
    host: "smtp.gmail.com",
  });

  let message = {
    from: "moh.abuhanifa@gmail.com",
    to: "muham.abuhanifa@gmail.com", // list of receivers
    subject: "Hello Muhammed", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "you should receive an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
});

app.post("/users", async (req, res) => {
  try {
    const {
      name,
      img,
      email,
      password,
      department,
      leaveStatus,
      isAdmin,
      passReset,
    } = req.body;
    const newEmployee = await pool.query(
      "INSERT INTO employee (name, img, email, department, leaveStatus, isAdmin, passReset, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, img, email, department, leaveStatus, isAdmin, passReset, password]
    );

    res.status(201).json({
      message: `Successfully created a new employee with ${name} and ${email}`,
      data: newEmployee.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

/* ---------------------app listening on port-------------------- */
app.listen(port, () => {
  console.log(`Application running at ${port}`);
});
