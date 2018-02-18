/*
 * Solution to exercises B, C, E and F.
 *
 * Copyright © 2016-2018 by Ariel Ortiz.
 *
 * Free use of this source code is granted under the terms of the
 * GPL version 3 License.
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.set('json spaces', 2);

app.listen(process.env.PORT, () => {
  console.log('Web server running as: ' + process.env.C9_HOSTNAME);
});

const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'username', // <-- Update this line with your username.
  database: 'c9'
});

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to the database.');
    throw err;
  } else {
    console.log('Connected to the database.');
  }
});

function makeUrl(id) {
  return 'http://' + process.env.C9_HOSTNAME + '/quotations/' + id;
}

app.get('/quotations', (req, res) => {
  let orderClause = req.query.sort === 'true' ? ' ORDER BY author' : '';
  db.query('SELECT id, author, excerpt FROM quotations' + orderClause,
    (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        let result = rows.map(row =>
          ({
             id: row.id,
             author: row.author,
             prelude: row.excerpt.split(/\s+/).slice(0, 3).join(' ') + '...',
             url: makeUrl(row.id)
           })
        );
        res.json(result);
      }
    });
});

app.get('/quotations/:id', (req, res) => {
  db.query('SELECT id, author, excerpt FROM quotations WHERE id = ?',
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        let row = rows[0];
        if (row) {
          res.json({
            id: row.id,
            author: row.author,
            excerpt: row.excerpt,
            url: makeUrl(row.id)
          });
        } else {
          res.type('text').status(404).send('Resource not found.\n');
        }
      }
    });
});

app.put('/quotations/:id', (req, res) => {
  let id = req.params.id;
  let body = getBody(req);
  if (body) {
    db.query('UPDATE quotations SET author=?, excerpt=? WHERE id=?',
      [body.author, body.excerpt, id],
      (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          if (result.affectedRows === 1) {
            res.type('text').send(
              'Resource with ID = ' + id + ' updated.\n');
          } else {
            res.type('text').status(400).send(
              'Unable to update resource with ID = ' + id + '.\n');
          }
        }
      });
  } else {
    res.type('text').status(400).send(
      'Bad data. No resource updated.\n');
  }
});

function getBody(req) {
  let body = req.body;
  let correctContentType =
    req.headers['content-type'].startsWith('application/json');
  let correctProperties =
    body.author !== undefined && body.excerpt !== undefined;

  if (correctContentType && correctProperties) {
    return { author: body.author, excerpt: body.excerpt };
  } else {
    return undefined;
  }
}

app.delete('/quotations/:id', function (req, res) {
  let id = req.params.id;
  db.query('DELETE FROM quotations WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        if (result.affectedRows === 1) {
          res.type('text').send(
            'Resource with ID = ' + id + ' deleted successfully.\n');
        } else {
          res.type('text').status(404).send(
            'Unable to delete resource with ID = ' + id + '.\n');
        }
      }
    });
});

app.post('/quotations', function (req, res) {
  var body = getBody(req);
  if (body) {
    db.query('INSERT INTO quotations SET author = ?, excerpt = ?',
      [body.author, body.excerpt],
      (err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          var id = result.insertId;
          res.set('location', makeUrl(id));
          res.type('text').status(201).send(
            'New resource created with ID = ' + id + '.\n');
        }
      });
  } else {
    res.type('text').status(400).send('Bad data. No resource created.\n');
  }
});
