const express = require("express");
const router = express.Router();
const pool = require("../db");


// GET ALL EMPLOYEES
router.get("/", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT e.*, d.department_name, dv.division_name
      FROM employees e
      LEFT JOIN departments d
      ON e.department_id = d.department_id
      LEFT JOIN divisions dv
      ON e.division_id = dv.division_id
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Error fetching employees" });

  }
});


// GET ALL DIVISIONS
router.get("/divisions", async (req, res) => {
  try {

    const result = await pool.query("SELECT * FROM divisions");
    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Error fetching divisions" });

  }
});


// GET ALL DEPARTMENTS
router.get("/departments", async (req, res) => {
  try {

    const result = await pool.query("SELECT * FROM departments");
    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Error fetching departments" });

  }
});


// ADD EMPLOYEE
router.post("/", async (req, res) => {

  try {

    let { emp_no, first_name, last_name, email, phone, division_id, department_id } = req.body;

    // Validate employee number
    if (!emp_no) {
      return res.status(400).json({ error: "Employee number is required" });
    }

    // Convert to integers
    emp_no = parseInt(emp_no);
    division_id = division_id ? parseInt(division_id) : null;
    department_id = department_id ? parseInt(department_id) : null;

    // Check if employee number already exists
    const existingEmployee = await pool.query(
      "SELECT * FROM employees WHERE emp_no = $1",
      [emp_no]
    );

    if (existingEmployee.rows.length > 0) {
      return res.status(400).json({ error: "Employee number already exists" });
    }

    const result = await pool.query(
      `INSERT INTO employees
      (emp_no, first_name, last_name, email, phone, division_id, department_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [emp_no, first_name, last_name, email, phone, division_id, department_id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Insert error" });

  }
});


// DELETE EMPLOYEE
router.delete("/:id", async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    await pool.query(
      "DELETE FROM employees WHERE employee_id = $1",
      [id]
    );

    res.json({ message: "Employee deleted successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Delete error" });

  }

});

module.exports = router;