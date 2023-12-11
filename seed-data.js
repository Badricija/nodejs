const mysql = require('mysql2');
const DB_NAME = 'my_first_database'

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'example',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log('Connected to MySQL server');

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
  connection.query(createDatabaseQuery, (createDatabaseError, createDatabaseResults) => {
    if (createDatabaseError) {
      console.error('Error creating database:', createDatabaseError);
      connection.end();
      return;
    }

    console.log(`Database "${DB_NAME}" created or already exists`);

    // Switch to the created database
    connection.changeUser({ database: DB_NAME }, (changeUserError) => {
      if (changeUserError) {
        console.error('Error switching to database:', changeUserError);
        connection.end();
        return;
      }

      console.log(`Switched to database "${DB_NAME}"`);

      // Define the SQL query to create a table if not exists
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT FALSE
        )
      `;

      // Execute the query to create the table
      connection.query(createTableQuery, (createTableError, createTableResults) => {
        if (createTableError) {
          console.error('Error creating table:', createTableError);
          connection.end();
          return;
        }

        console.log('Table "tasks" created or already exists');

        // Define the SQL query to insert data into the table
        const insertDataQuery = `
          INSERT INTO tasks (name, description, complete, id) VALUES
          {
            "taskName": "Uztaisīt vakariņas",
            "taskDescription": "Vistiņa",
            "isComplete": false,
            "id": 1
          },
          {
            "taskName": "Nomazgāt trukus",
            "taskDescription": "cokcovx",
            "isComplete": false,
            "id": 2
          },
          {
            "taskName": "Iziet skati autiņam",
            "taskDescription": "Tirgošana",
            "isComplete": false,
            "id": 3
          },
          {
            "taskName": "Noķert kovidu",
            "taskDescription": "Mājās sēžot",
            "isComplete": false,
            "id": 4
          }
        `;

        // Execute the query to insert data
        connection.query(insertDataQuery, (insertDataError, insertDataResults) => {
          if (insertDataError) {
            console.error('Error inserting data:', insertDataError);
          } else {
            console.log('Data inserted into "tasks" table');
          }

          // Close the connection
          connection.end();
        });
      });
    });
  });
});