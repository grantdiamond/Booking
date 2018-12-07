const DataObjs = require('./dataObjs.js');
var redis = require('redis'),
client = redis.createClient();
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

// CREATES AND MUTATES THE NON-AVAILABILITY DATA

var randomMetaData = function() {
  var price = Math.floor(Math.random() * 300 + 50);
  var maxGuests = Math.floor(Math.random() * 15 + 1);
  var minStay = Number(minimumStay[randomIndexOf(minimumStay)]);
  var stars = Number(rating[randomIndexOf(rating)] * 10);
  var numRatings = Math.ceil(Math.random() * 200);
  return [price, maxGuests, minStay, stars, numRatings];
};

//FUNCTION WHICH GENERATES A RANDOM LINE

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
    let lengthOfStayArr = weightedArrays[firstDay];
    let length = Number(lengthOfStayArr[randomIndexOf(lengthOfStayArr)]);
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
  var str = result.join('');
  metaData.push(str);
  return metaData;
};


//REPEATS MY RANDOMIZATION FUNCTION FOR SEEDING

var randomizeRepeat = function(num, func, args) {
  var result = [];
  for (let i = 0; i < num; ++i) {
    var params = [...arguments].slice(2);
    var thisResult = func(...params);
    result.push(thisResult);
  }
  return result;
};


//DATA SEEDING FUNCTIONALITY

var id = 1;
var responses = 0;
var counter = 0;
var iterations = 10000;

var then = new Date();

var bitWrite = function(arr) {
  counter++;
  for (let i = 0; i < arr.length; ++i) {
    var key = 'apartments';
    var at = [13, 17, 22, 28, 38, 68, 98];
    var data = arr[i];
    var offset = (id * 128) - 128;
    var availability = data[5];
    var first30 = parseInt(availability.slice(0, 30), 2).toString(10);
    var middle30 = parseInt(availability.slice(30, 60), 2).toString(10);
    var final30 = parseInt(availability.slice(60, 90), 2).toString(10);
    //COMMAND THAT GETS SENT TO REDIS SERVER:
    client.bitfield(                              
      key,                                        
      'set', 'u13', offset,         data[0],      //price
      'set', 'u4',  offset + at[0], data[1] - 1,  //max-guests
      'set', 'u5',  offset + at[1], data[2],      //minimum-stay
      'set', 'u6',  offset + at[2], data[3],      //rating
      'set', 'u10', offset + at[3], data[4],      //num of reviews
      'set', 'u30', offset + at[4], first30,      //first 30 days
      'set', 'u30', offset + at[5], middle30,     //next 30 days
      'set', 'u30', offset + at[6], final30,      //next 30 days
      function(err, res) {
        if (err) {
          console.log('error on id', id, 'message:', err)
        }
        responses++;
      }
    );
    id++; //increment ID for next invocation of func
    if (i === arr.length - 1) { //double-confirmation that all data was seeded
      client.getbit(key, offset, function(err, res) {
        if (responses === 1000) {
          if (counter < iterations) { 
            console.log(
              ((counter / iterations) * 100).toFixed(2).toString() + ' %'
            );
            responses = 0;
            //INVOKE THE SEEDING FUNCTION AGAIN:
            bitWrite(invoker)
          } else { //ALL DATA HAS LOADED
            var now = new Date();
            var seconds = (now - then) / 1000;
            var time = formatTime(seconds);
            console.log('ALL DATA LOADED ................in ' + time);
          }
        }
      });
    }
  }
};

//INVOKE FIRST CHUNK

var invoker = randomizeRepeat(1000, randomize, 90, 5, 20)
bitWrite(invoker);