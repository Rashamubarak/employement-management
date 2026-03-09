const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success:false, message:"Missing credentials" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1 AND password=$2",
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ success:true });
    } else {
      res.json({ success:false });
    }

  } catch(err) {

    console.error(err);
    res.status(500).json({error:"Login error"});

  }

});