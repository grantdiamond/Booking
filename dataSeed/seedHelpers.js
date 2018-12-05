const DataObjs = require('./dataObjs')

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

var week = createWeightedArray(DataObjs.initialDayChances);
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

// FORMAT TIME FOR LOGGING

var formatTime = function(num) {
  if (num < 60) {
    return num.toString() + ' seconds';
  } else {
    var minutes = Math.floor(num / 60).toString();
    var seconds = (num % 60).toFixed(2).toString();
    return minutes + ' min ' + seconds + ' sec';
  }
};

exports.randomNumOfTries = randomNumOfTries;
exports.randomIndexOf = randomIndexOf;
exports.randomOffsetFromToday = randomOffsetFromToday;
exports.createWeightedArray = createWeightedArray;
exports.week = week;
exports.minimumStay = minimumStay;
exports.rating = rating;
exports.weightedArrays = weightedArrays;
exports.emptyRow = emptyRow;
exports.formatTime = formatTime;