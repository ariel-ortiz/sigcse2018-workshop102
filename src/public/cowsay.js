/*
 * A Web Client: cowsay
 *
 * Copyright © 2016-2018 by Ariel Ortiz.
 *
 * Free use of this source code is granted under the terms of the
 * GPL version 3 License.
 */

/* global $ */

var QUOTATION_URL = 'http://host-name/quotations/'; // <-- Update the host-name

function start() {
  $.ajax({
    url: QUOTATION_URL,
    method: 'GET'
  })
  .done(getAllQuotations)
  .fail(displayError);
}

function getAllQuotations (quotations) {
  var rndNum = (quotations.length * Math.random()) | 0;
  $.ajax({
    url: quotations[rndNum].url,
    method: 'GET'
  })
  .done(getOneQuote)
  .fail(displayError);
}

function getOneQuote (quote) {
  $('#excerpt').text(quote.excerpt);
  $('#author').text(quote.author);
  $('#cowsay').show();
}

function displayError (err) {
  alert(JSON.stringify(err));
}

$(start);