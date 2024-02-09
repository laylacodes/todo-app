const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// Endpoint to insert values
app.post('/insert', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "ADMIN",
      password: "NikoMassey2023", // Change as per your setup
      connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.us-phoenix-1.oraclecloud.com))(connect_data=(service_name=ge1a5fd8f6c4dbf_gabbagool_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))" // Change as per your setup
    });

    const { id, data } = req.body;
    const sql = `INSERT INTO nodetab VALUES (:1, :2)`;
    await connection.execute(sql, [id, data], { autoCommit: true });

    res.json({ message: 'Insert successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error inserting data' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

