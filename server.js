const express = require("express");
const cors = require("cors");
const pool = require("./db");
const nodemailer = require("nodemailer");
/* ---------------------Express app-------------------- */
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();
const port = process.env.PORT || 5000;

let transporter = nodemailer.createTransport({
  service: "gmail", // true for 465, false for other ports
  auth: {
    user: "moh.abuhanifa@gmail.com",
    pass: process.env.GMAIL_PASS, // generated ethereal password
  },
  port: 465,
  host: "smtp.gmail.com",
});

app.get("/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
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

app.put("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { name, img, password, department, leavestatus, isadmin, passreset } =
      req.body.body;

    const user = await pool.query(
      "UPDATE employee SET name=$1, img=$2, password=$3, department=$4, leavestatus=$5, isadmin=$6, passreset=$7 WHERE email=$8 RETURNING *",
      [name, img, password, department, leavestatus, isadmin, passreset, email]
    );

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

    const isLogin = user.rows[0]?.password === password;

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

app.get("/users", async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM employee");

    res.status(201).json({
      message: `success`,
      data: user.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/users", async (req, res) => {
  try {
    const {
      name,
      img,
      email,
      password,
      department,
      leavestatus,
      isadmin,
      passreset,
    } = req.body;

    const newEmployee = await pool.query(
      "INSERT INTO employee (name, img, email, department, leaveStatus, isAdmin, passReset, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, img, email, department, leavestatus, isadmin, passreset, password]
    );
    let message = {
      from: "moh.abuhanifa@gmail.com",
      to: email, // list of receivers
      subject: "Your Leave Application login credentials", // Subject line
      text: `Your email is ${email} and password is ${password}. Reset your password to make a leave application`, // plain text body
    };

    transporter
      .sendMail(message)
      .then((info) => {
        return res.status(201).json({
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info),
          message: `Successfully created a new employee with ${name} and ${email}`,
          data: newEmployee.rows,
        });
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  } catch (error) {
    console.log(error);
  }
});

/* ---------------------app listening on port-------------------- */
app.listen(port, () => {
  console.log(`Application running at ${port}`);
});
