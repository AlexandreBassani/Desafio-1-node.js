const express = require('express');
const bodyParser = require('body-parser');
const Task = require('./models/task');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(bodyParser.json());

app.use('/api', tasksRouter);

app.listen(3000, async () => {
  console.log('Server running on http://localhost:3000');
  await Task.sync();  // Sincroniza o modelo com o banco de dados
});
