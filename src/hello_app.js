/*
 * Solution to exercise A.
 *
 * Copyright © 2016-2018 by Ariel Ortiz.
 *
 * Free use of this source code is granted under the terms of the
 * GPL version 3 License.
 */

'use strict';

const express = require('express');
const app = new express();

app.get('/hello', (req, res) => {
  let who = req.query.who || 'Anonymous';
  res.type('text').send(`Hello ${ who }!\n`);
});

app.listen(process.env.PORT, () => {
  console.log('Server running as: ' + process.env.C9_HOSTNAME);
});
