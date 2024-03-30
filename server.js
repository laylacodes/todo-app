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
      user: "ADMIN",
      password: "NikoMassey2023",
      connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-phoenix-1.oraclecloud.com))(connect_data=(service_name=ge1a5fd8f6c4dbf_gabbagool_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
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
      user: "ADMIN",
      password: "NikoMassey2023",
      connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-phoenix-1.oraclecloud.com))(connect_data=(service_name=ge1a5fd8f6c4dbf_gabbagool_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
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
      user: "ADMIN",
      password: "NikoMassey2023",
      connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-phoenix-1.oraclecloud.com))(connect_data=(service_name=ge1a5fd8f6c4dbf_gabbagool_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
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
        user: "ADMIN",
        password: "NikoMassey2023",
        connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-phoenix-1.oraclecloud.com))(connect_data=(service_name=ge1a5fd8f6c4dbf_gabbagool_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
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