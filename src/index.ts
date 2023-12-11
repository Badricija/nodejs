import express from 'express';
import cors from 'cors';
import { connection } from "./db";
import { ResultSetHeader } from 'mysql2';

const app = express();
const port = 3001; 

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/tasks', async (req, res) => {
  connection.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.post('/tasks', async (req, res) => {
  const { taskName, taskDescription, isComplete } = req.body;
  connection.query(
    'INSERT INTO tasks (taskName, taskDescription, isComplete) VALUES (?, ?, ?)',
    [taskName, taskDescription, isComplete],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const header = results as ResultSetHeader;
      res.status(201).json({ id: header.insertId, taskName, taskDescription, isComplete });
    }
  );
});

app.patch('/tasks/:id', async (req, res) => {
  const { taskName, taskDescription, isComplete } = req.body;
  connection.query('UPDATE tasks SET taskName = ?, taskDescription = ?, isComplete = ? WHERE id = ?',
    [taskName, taskDescription, isComplete, req.params.id], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Task updated successfully' });
    });
});

app.patch('/tasks/complete/:id', async (req, res) => {
  connection.query('UPDATE tasks SET isComplete = !isComplete WHERE id = ?',
    [req.params.id], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ message: 'Task completion status updated' });
    });
});

app.delete('/tasks/:id', async (req, res) => {
  connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
