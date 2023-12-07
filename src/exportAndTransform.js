const fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

const files = 3;
let filesFinished = 0;

// File sizes are very large. Use node --max-old-space-size=100000 exportAndTransform.js

const filepathETL = async (filepath, tableName, columns) => {
  connection.connect();
  connection.query('SET foreign_key_checks = 0', (err) => {
    if (err) throw err;
  });

  let lineNumber = 0;
  let buffer = '';
  let count = 0;

  const data = fs.createReadStream(filepath, { encoding: 'utf-8', highWaterMark: 64 * 1024 });
  data.on('data', (chunk) => {
    buffer += chunk;
    const rows = buffer.split('\n');
    for (let i = (lineNumber === 0 ? 1 : 0); i < rows.length - 1; i++) {
      lineNumber = 1;
      let row = rows[i].split(',');
      const values = row.map(value => `${value}`).join(',');
      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values})`;
      connection.query(query);
    }
    buffer = rows[rows.length - 1];
  });

  data.on('end', () => {
    if (buffer.trim() !== '') {
      const values = buffer.split(',').map(value => `${value}`).join(',');
      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values})`;
      connection.query(query, (error, results, fields) => { })
      filesFinished++;
      if (filesFinished === files) {
        connection.query('SET foreign_key_checks = 1', (err) => {
          if (err) throw err;
        })
        connection.end();
      }
    }
  });

  data.on('error', (error) => {
    throw error;
  })
};

// filepaths
const questionsFilePath = '../data/questions.csv';
const answersFilePath = '../data/answers.csv';
const answersPhotosFilePath = '../data/answers_photos.csv';

// columns
const questionsColumns = ['id', 'product_id', 'body', 'date_written', 'asker_name', 'asker_email', 'reported', 'helpful'];
const answersColumns = ['id', 'question_id', 'body', 'date_written', 'answerer_name', 'answerer_email', 'reported', 'helpful'];
const answersPhotosColumns = ['id', 'answer_id', 'url'];

// functions
filepathETL(questionsFilePath, 'questions', questionsColumns);
filepathETL(answersFilePath, 'answers', answersColumns);
filepathETL(answersPhotosFilePath, 'answers_photos', answersPhotosColumns);