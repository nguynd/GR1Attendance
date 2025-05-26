const pool = require('../db');

exports.createClass = async (req, res) => {
  const { class_code, class_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO classes (class_code, class_name) VALUES ($1, $2) RETURNING *',
      [class_code, class_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM classes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
