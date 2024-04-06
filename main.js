const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

app.use(cors());

const config = {
  user: 'mltadmin',
  password: 'malith@123',
  server: 'mltdbserver.database.windows.net',
  database: 'application_weatherDB',
  options: {
    encrypt: true
  }
};

const port = process.env.PORT || 3030;

sql.connect(config)
.then(pool => {
  console.log('Connected to Azure SQL DB');
})
.catch(err => {
  console.error('Database connection failed: ',err);
});

//Endpoint to get all data
app.get('/weather', async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Query to select all data from the weather table
    const result = await sql.query`SELECT * FROM districts`;

    // Close the database connection
    await sql.close();

    // Send the data as JSON in the response
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to fetch data from the weather table based on district
app.get('/weather/:district', async (req, res) => {
  const district = req.params.district;
  try {
    // Connect to the database
    await sql.connect(config);

    // Query to select data from the weather table based on district
    const result = await sql.query`SELECT * FROM districts WHERE name = ${district}`;

    // Close the database connection
    await sql.close();

    // Send the data as JSON in the response
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


//generate and insert random data into the database

const districts = ['Ampara', 'Anuradhapura', 'Bhadulla', 'Batticoloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy'];

const generateRandomData = () => {
    const temperature = (Math.random() * (35 - 20) + 20).toFixed(2);
    const humidity = (Math.random() * (100 - 60) + 60).toFixed(2);
    const windSpeed = (Math.random() * (1020 - 1000) + 1000).toFixed(2);
    const dist = districts[Math.floor(Math.random() * districts.length)]; // Randomly select a province

    const query = `UPDATE weather SET humidity=${humidity}, temp=${temperature}, wind=${windSpeed} WHERE district = ${dist}`;
    connection.query(query, [temperature, humidity, airPressure, province], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
        } else {
            console.log('Weather data inserted successfully');
        }
    });
};

// Generate data every 5 minutes
setInterval(generateRandomData, 5 * 60 * 1000);

// Generate initial data immediately
generateRandomData();

