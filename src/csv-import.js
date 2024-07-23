const fs = require('fs');
const csv = require('csv-parser');
const Task = require('./models/task');

async function importTasks(filePath) {
  const tasks = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      tasks.push({
        title: row.title,
        description: row.description,
        completed_at: row.completed_at ? new Date(row.completed_at) : null
      });
    })
    .on('end', async () => {
      try {
        await Task.bulkCreate(tasks);
        console.log('Tasks imported successfully');
      } catch (error) {
        console.error('Error importing tasks:', error);
      }
    });
}

importTasks('tasks.csv'); // Substitua pelo caminho do seu arquivo CSV
