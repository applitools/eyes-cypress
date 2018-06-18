'use strict';

function getFolderName(renderId, date) {
  return `${formatDate(date)}_${renderId}`;
}

function pad(num) {
  return num < 10 ? `0${num}` : String(num);
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}-${d.getHours()}${d.getMinutes()}`;
}

module.exports = getFolderName;
