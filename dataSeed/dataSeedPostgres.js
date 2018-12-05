const DataObjs = require('./dataObjs.js');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    database: 'booking'
  }
});
const Promise = require('bluebird');
const {
  randomNumOfTries,
  randomIndexOf,
  randomOffsetFromToday,
  week,
  minimumStay,
  rating,
  weightedArrays,
  emptyRow,
  formatTime
} = require('./seedHelpers');

// CREATES AND MUTATES THE NON-CALENDAR DATA

var randomMetaData = function() {
  var price = Math.floor(Math.random() * 300) + 50;
  var maxGuests = Math.floor(Math.random() * 8) + 2;
  var minStay = Number(minimumStay[randomIndexOf(minimumStay)]);
  var stars = Number(rating[randomIndexOf(rating)]);
  var numRatings = Math.ceil(Math.random() * 200);
  return [price, maxGuests, minStay, stars, numRatings];
};

var updateRandomMetaData = function(arr) {
  for (let obj of arr) {
    obj['price'] = Math.floor(Math.random() * 300) + 50;
    obj['max'] = Math.floor(Math.random() * 8) + 2;
    obj['minStay'] = Number(minimumStay[randomIndexOf(minimumStay)]);
    obj['stars'] = Number(rating[randomIndexOf(rating)]);
    obj['numratings'] = Math.ceil(Math.random() * 200);
  }
  return 'updated';
};

//CONVERTS ARRAY TO OBJ FOR INSERTION IN TO DATABASE

var convertToObj = function(arr) {
  var result = {
    price: arr[0],
    max: arr[1],
    minStay: arr[2],
    stars: arr[3],
    numratings: arr[4]
  };
  for (let i = 5; i < arr.length; ++i) {
    result[i - 4] = arr[i];
  }
  return result;
};

//FUNCTION WHICH GENERATES A RANDOM ROW

var randomize = function(numOfCalendarDays, minTries, maxTries) {
  let numberOfDays = numOfCalendarDays || 90;
  let minimum = minTries || 1;
  let maximum = maxTries || 100;
  let result = emptyRow(numberOfDays);
  let metaData = randomMetaData();
  let minStay = metaData[2];
  let tries = randomNumOfTries(minimum, maximum);
  let maximumWeeks = Math.floor(result.length / 7);
  for (let i = 0; i < tries; ++i) {
    let firstDay = week[randomIndexOf(week)];
    let dayArr = weightedArrays[firstDay];
    let length = Number(dayArr[randomIndexOf(dayArr)]);
    if (length < minStay) {
      continue;
    }
    let randomWeek = randomOffsetFromToday(maximumWeeks);
    let begin = randomWeek + DataObjs.dayConversions[firstDay];
    let end = begin + length;
    let canInsert = true;
    for (let j = begin; j < end; ++j) {
      if (result[j] === 1) {
        canInsert = false;
        break;
      }
    }
    if (canInsert === false) {
      continue;
    }
    for (let k = begin; k < end; ++k) {
      if (k >= result.length) {
        break;
      }
      result[k] = 1;
    }
  }
  result = metaData.concat(result);
  return convertToObj(result);
};

//REPEATS MY RANDOMIZATION FUNCTION FOR BOTH TESTING AND SEEDING

var repeat = function(num, func, args) {
  var result = [];
  for (let i = 0; i < num; ++i) {
    var params = [...arguments].slice(2);
    var thisResult = func(...params);
    result.push(thisResult);
  }
  return result;
};

//DATA SEEDING FUNCTIONALITY

var then = new Date();

var evenRows = repeat(2000, randomize, 90, 5, 20);
var oddRows = repeat(2000, randomize, 90, 5, 20);
var rows = [evenRows, oddRows];

var counter = 0;

var seed = function(iterations) {
  counter++;
  Promise.all([
    updateRandomMetaData(rows[counter % 2]),
    knex.batchInsert('bookings', rows[(counter + 1) % 2], 150)
  ])
    .then(str => {
      if (counter % 50 === 0) {
        console.log((counter / 50).toString() + '%')
      }
      if (counter < iterations) {
        seed(iterations);
      } else {
        var now = new Date();
        var seconds = (now - then) / 1000;
        var time = formatTime(seconds);
        console.log('ALL DATA LOADED ................in ' + time);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

seed(5000);