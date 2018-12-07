const Redis = require('ioredis');
const redis = new Redis();

const moment = require('moment');
const schedule = require('node-schedule');

const { padZeroes, isValid, checkNextID, checkForConflict } = require('./databaseHelpers');
const rebuilders = require('./rebuilders')
const queries = require('./redisQueries')
const { bits, key } = require('../database/constants')

const automaticRebuild = schedule.scheduleJob('0 0 0 * * *', function() {
  rebuild();
});

var rebuild = function() {
  rebuilders.areWorking = true;
  return checkNextID()
  .then(num => {
    var total = num - 1;
    return rebuilders.rebuildRedis(total);
  })
  .then(res => {
    return res;
  })
  .catch(err => {
    console.log(err, 'err')
    return err;
  })
};

var getData = id => {
  if (rebuilders.areWorking) {
    if (checkForConflict()) {
      setTimeout(() => {
        getData(id);
      }, 200);
    }
  }
  var args = queries.get(id);
  return redis
    .bitfield(key, args)
    .then(result => {
      var dateString = '';
        dateString += padZeroes(result[5], 30);
        dateString += padZeroes(result[6], 30);
        dateString += padZeroes(result[7], 30);
      var dates = [];
      var today = moment(today);
      for (let i = 0; i < dateString.length; ++i) {
        if (dateString[i] === '1') {
          var thisDate = today.clone().add(i, 'day').format('MM/DD/YYYY');
          dates.push(thisDate);
        }
      }
      var dataObj = {
        price: result[0],
        apartmentid: Number(id),
        max: result[1] + 1,
        minStay: result[2],
        stars: result[3] / 10,
        numRatings: result[4],
        dates: dates
      };
      return dataObj;
    })
    .catch(err => {
      return err;
    });
};

var updateListing = function(dataObj, id) {
  return isValid()
    .then(response => {
      if (response !== true) {
        for (let log of response) {
          console.log(log);
        }
        throw new Error('Listing was not updated! See logs.');
      } else {
        let params = Object.keys(dataObj);
        let args = [key];
        for (let param of params) {
          args = args.concat(set[param](dataObj[param], id));
        }
        return redis.bitfield(args).then((result, err) => {
          if (err) {
            throw new Error('Database failed to update.');
          } else {
            return `Database updated successfully, redis-cli responds with ${result}`;
          }
        });
      }
    })
    .catch(err => {
      return err;
    });
};

var updateAvailability = function(dataObj, id) {
  return isValid()
    .then(response => {
      if (response !== true) {
        for (let log of response) {
          console.log(log);
        }
        throw new Error('Listing was not updated! See logs.');
      } else {
        let offset = id * bits - bits;
        let dates = Object.keys(dataObj);
        let args = [];
        let today = moment(0, 'HH');
        for (let date of dates) {
          let difference = today.diff(thisDate, 'days') * -1;
          args = args.concat(['setbit', key, offset + difference, dataObj[date]]);
        }
        return redis.pipeline(args).exec().then((result, err) => {
          if (err) {
            throw new Error('Database failed to update.');
          } else {
            return 'Listing updated successfully.';
          }
        });
      }
    })
    .catch(err => {
      return err;
    });
}

var createListing = function(obj, id) {
  return checkNextID()
    .then(nextID => {
      if (id !== nextID) {
        throw new Error(`Invalid ID. Next available listing is ${nextID}`);
      }
      return isValid(obj);
    })
    .catch(err => {
      return err;
    })
    .then(response => {
      if (response !== true) {
        for (let log of response) {
          console.log(log);
        }
        throw new Error('Listing was not created! See logs.');
      } else {
        var price, max, minStay, stars, numRatings, dates;
        price = set.price(obj.price, id);
        max = set.max(obj.max, id);
        minStay = set.minStay(obj.minStay, id);
        stars = set.stars(obj.stars, id);
        numRatings = set.numRatings(obj.numRatings, id);
        dates = set.availability(obj.dates, id);
        var args = [price, max, minStay, stars, numRatings, dates];
        return redis.bitfield('arguments', args).then((result, err) => {
          if (err) {
            throw new Error('Error updating database!');
          } else {
            return 'Listing created successfully!';
          }
        });
      }
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      return err;
    });
};

var set = {
  price: function(num, id) {
    var offset = (id * bits) - bits;
    return ['set', 'u13', offset, num];
  },
  maxGuests: function(num, id) {
    var offset = (id * bits) - bits + 13;
    return ['set', 'u4', offset, num];
  },
  minStay: function(num, id) {
    var offset = (id * bits) - bits + 17;
    return ['set', 'u5', offset, num];
  },
  rating: function(num, id) {
    var offset = (id * bits) - bits + 22;
    return ['set', 'u6', offset, num];
  },
  numOfReviews: function(num, id) {
    var offset = (id * bits) - bits + 38;
    return ['set', 'u10', offset, num];
  },
  dates: function(num, id) {
    var offset = 68;
    var str = num.toString();
    var last = str.slice(-30);
    var middle = str.slice(-60, -30);
    var first = str.slice(0, -60);
    var args = [first, middle, last];
    var result = [];
    for (let i = 0; i < args.length; ++i) {
      result.push('set');
      result.push('u30');
      result.push(offset);
      result.push(parseInt(args[i], 10).toString(2));
      offset += 30;
    }
    return result;
  },
  availability: function(position, numOfDays, bool, id) {
    var num = 0;
    if (bool === true) {
      num = 1;
    }
    var result = [];
    var offset = id * bits + 38 + position;
    for (let i = 0; i < numOfDays; ++i) {
      result.push('set');
      result.push('u1');
      result.push(offset);
      result.push(num);
      offset++;
    }
    return result;
  }
};

exports.getData = getData;
exports.updateListing = updateListing;
exports.updateAvailability = updateAvailability;
exports.createListing = createListing;
exports.rebuild = rebuild;