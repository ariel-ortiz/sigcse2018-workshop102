/*
 * Solution to exercise D.
 *
 * Copyright © 2016-2018 by Ariel Ortiz.
 *
 * Free use of this source code is granted under the terms of the
 * GPL version 3 License.
 */

'use strict';

const request = require('request');
const URL = 'http://localhost:8080/quotations';

request(URL, (err, response, body) => {
  if (err || response.statusCode !== 200) {
    console.error('ERROR: ' + (err || body));
  } else {
    let result = JSON.parse(body);
    for (let q of result) {
      console.log('%d - %s: %s', q.id, q.author, q.prelude);
    }
  }
});
