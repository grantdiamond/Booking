const Redis = require('ioredis');
const redis = new Redis();
const { bits, key, chunkSize } = require('./constants')
const rebuilders = require('./rebuilders.js')

exports.padZeroes = function(integer, finalLength) {
  let str = parseInt(integer, 10).toString(2);
  let result = '';
  let difference = finalLength - str.length;
  if (str.length > finalLength) {
    for (let i = 0; i > difference; --i) {
      result = result.slice(1);
    }
  } else {
    for (let i = 0; i < difference; ++i) {
      result += '0';
    }
  }
  result += str;
  return result;
};

exports.isValid = function(obj) {
  var log = [];
  if (obj.price < 1 || obj.price > 8191 || !Number.isInteger(obj.price)) {
    log.push('Price must be a whole number between 1 and 8191!');
  }
  if (obj.max < 1 || obj.max > 16 || !Number.isInteger(obj.max)) {
    log.push('Maximum guests must be a whole number between 1 and 16!');
  }
  if (obj.minStay < 1 || obj.minStay > 30 || !Number.isInteger(obj.minStay)) {
    log.push('Minimum stay must be a whole number between 1 and 30!');
  }
  if (obj.numRatings === 0) {
    if (obj.stars !== 0) {
      log.push('Listings without any reviews cannot have a rating!');
    }
  }
  if (obj.numRatings < 0 || !Number.isInteger(obj.numRatings)) {
    log.push('Number of ratings must be a whole number greater than zero!');
  }
  if (obj.numRatings > 1023) {
    log.push('Maximum number of reviews is 1023!');
  }
  if (obj.stars < 10 || obj.stars > 50) {
    log.push('Ratings must be between 1.0 and 5.0!');
  }
  var today = moment(0, 'HH');
  for (let thisDate of obj.dates) {
    var difference = today.diff(thisDate, 'days') * -1;
    if (difference < 1 || difference > 90) {
      log.push(
        `All dates must be within 90 days of today! ${thisDate} is not a valid date.`
      );
    }
  }
  if (log.length === 0) {
    return true;
  } else {
    return log;
  }
};

exports.checkNextID = function() {
  return redis.strlen(key)
    .then(result => {
      return (result * 8) / bits + 1;
    })
    .catch(err => {
      return err;
    });
};

exports.checkForConflict = function(id) {
  if (rebuilders.rebuilt - id < chunkSize * 5 && rebuilders.rebuilt - id > 0) {
    return true;
  }
  return false;
  }
};
