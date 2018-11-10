const DataObjs = require('./dataObjs.js');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    database: 'booking'
  }
});

const Promise = require('bluebird');

//RANDOMIZING HELPER FUNCTIONS

var randomNumOfTries = function(minTries, maxTries) {
  var difference = maxTries - minTries;
  return minTries + Math.ceil(Math.random() * difference);
};

var randomIndexOf = function(arr) {
  return Math.floor(Math.random() * arr.length);
};

var randomOffsetFromToday = function(maxWeeks) {
  return 7 * Math.floor(Math.random() * maxWeeks) - 1;
};

//CONVERT CHANCE OBJS IN TO ARRAYS FOR RANDOMIZATION

var createWeightedArray = function(obj) {
  var result = [];
  let keys = Object.keys(obj);
  for (let key of keys) {
    for (let i = 0; i < obj[key]; ++i) {
      result.push(key);
    }
  }
  return result;
};

//ESTBALISH WEIGHTED TABLES AS GLOBALS SO THAT
//THEY DON'T NEED TO BE RECREATED EACH TIME THEY ARE USED

var week = createWeightedArray(DataObjs.initalDayChances);
var minimumStay = createWeightedArray(DataObjs.minimumStayChances);
var rating = createWeightedArray(DataObjs.starChances);

var weightedArrays = {
  mon: createWeightedArray(DataObjs.lengthOfStayChances.mon),
  tues: createWeightedArray(DataObjs.lengthOfStayChances.tues),
  wed: createWeightedArray(DataObjs.lengthOfStayChances.wed),
  thurs: createWeightedArray(DataObjs.lengthOfStayChances.thurs),
  fri: createWeightedArray(DataObjs.lengthOfStayChances.fri),
  sat: createWeightedArray(DataObjs.lengthOfStayChances.sat),
  sun: createWeightedArray(DataObjs.lengthOfStayChances.sun)
};

// CREATES AN EMPTY ARRAY OF BOOLEAN FALSE VALUES

var emptyRow = function(num) {
  var empty = [];
  for (let i = 0; i < num; ++i) {
    empty.push(0);
  }
  return empty;
};

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
    minstay: arr[2],
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
  let minStay = result[3];
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

//DEVELOPMENT FUNCTION FOR TESTING

var calcOccupancy = function(arr) {
  let counter = 0;
  for (let i = 5; i < arr.length; ++i) {
    if (arr[i] === 1) {
      counter++;
    }
  }
  return counter / (arr.length - 5);
};

var formatTime = function(num) {
  if (num < 60) {
    return num.toString() + ' seconds'
  } else {
    var minutes = Math.floor(num / 60).toString();
    var seconds = (num % 60).toFixed(2).toString();
    return minutes + ' min ' + seconds + ' sec'
  }
}

//REPEATS MY RANDOMIZATION FUNCTION FOR BOTH TESTING AND SEEDING

var repeat = function(num, func, args) {
  var result = [];
  for (let i = 0; i < num; ++i) {
    var thisResult = func(args);
    if (typeof thisResult === 'array') {
      result = result.concat(thisResult.slice(5));
    } else {
      result.push(thisResult);
    }
  }
  return result;
};

//DATA SEEDING FUNCTIONALITY

var then = new Date()

var evenRows = repeat(2500, randomize, 90, 10, 30);
var oddRows = repeat(2500, randomize, 90, 10, 30);
var rows = [evenRows, oddRows];

var counter = 0;

var seed = function(iterations) {
  counter++;
  Promise.all([
    updateRandomMetaData(rows[counter % 2]),
    knex.batchInsert('bookings', rows[(counter + 1) % 2], 150)
  ])
    .then(str => {
      console.log(((counter / iterations) * 100).toFixed(2).toString() + '%');
      if (counter < iterations) {
        seed(iterations);
      } else {
        counter = 0;
        var now = new Date()
        var seconds = (now - then) / 1000
        var time = formatTime(seconds);
        console.log('ALL DATA LOADED ................in ' + time);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

seed(4000);
