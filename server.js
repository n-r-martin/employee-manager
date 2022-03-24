const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
// Import and require console.table
require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: 'rootROOT88{}',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

// // Hardcoded query: DELETE FROM course_names WHERE id = 3;

// db.query(`DELETE FROM course_names WHERE id = ?`, 3, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// // Query database
// db.query('SELECT * FROM department', function (err, results) {
//   console.table(results);
// });

db.promise().query('SELECT * FROM department').then((results) => {
  console.table(results[0]);
});

db.promise().query('SELECT * FROM role').then((results) => {
  console.table(results[0]);
});         


db.promise().query('SELECT * FROM employee').then((results) => {
  console.table(results[0]);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
