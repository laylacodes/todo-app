require('dotenv').config(); // DATABASE CREDENTIALS
const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// GET ALL TO-DO ITEMS
app.get('/items', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING
    });

    const result = await connection.execute(`SELECT * FROM nodetab`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});


// CREATE NEW TO-DO ITEM
app.post('/insert', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING
    });

    const { description, status } = req.body;
    const sql = `INSERT INTO nodetab (description, status) VALUES (:1, :2)`;
    await connection.execute(sql, [description, status], { autoCommit: true });
    // const sql = `INSERT INTO nodetab (description, status) VALUES (:description, :status)`;
    // await connection.execute(sql, { description: description, status: status }, { autoCommit: true });
    res.json({ message: 'Insert successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error inserting data' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error inserting data:", err.message, err);
        res.status(500).json({ message: 'Error inserting data', error: err.message });
      }
    }
  }
});

// DELETE TO-DO ITEM
app.delete('/item/:id', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING
    });

    const { id } = req.params;
    await connection.execute(`DELETE FROM nodetab WHERE id = :1`, [id], { autoCommit: true });
    res.json({ message: 'Delete successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting data' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// EDIT TO-DO ITEM
app.put('/update/:id', async (req, res) => {
  let connection;
  try {
      connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
      });
      const { id, description, status } = req.body;
      const result = await connection.execute(
          `UPDATE nodetab SET description = :description, status = :status WHERE id = :id`,
          { description, status, id }, // Make sure these match the placeholders in your SQL query
          { autoCommit: true }
      );
      res.json({ message: 'Update successful' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating data', error: err.message });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error("Error closing connection:", err);
          }
      }
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});