const Redis = require('ioredis');
const redis = new Redis();
const { key, bits, chunkSize } = require('./constants');

var rebuilding = false;
var rebuilt = 1;
var counter = 0;

const rebuildRedis = function(total) {
  if (rebuilt < total) {
    if ((total - rebuilt) > chunkSize) {
      rebuildChunk(rebuilt, chunkSize)
      .then(response => {
        rebuilt += chunkSize;
        counter++
        if (counter % 100 === 0) {
          console.log('rebuilt ' + (rebuilt / total * 100).toFixed(2) + ' %')
        }
        return rebuildRedis(total);
      })
      .catch(err => {
        return err
      });
    } else {
      let remainder = total - rebuilt;
      return rebuildChunk(rebuilt, remainder)
      .then(response => {
        rebuilt += remainder;
        return rebuildRedis(total);
      })
      .catch(err => {
        return err
      });
    }
  } else {
    rebuilding = false;
    rebuilt = 1;
    return 'Database rebuilt!';
  }
};

var buildGetQueries = function(idx, sizeOfChunk) {
  var args = [];
  for (let i = idx; i < (idx + sizeOfChunk); ++i) {
    var offset = i * bits - bits;
    var queries = [
      'get', 'u29', offset + 39,
      'get', 'u30', offset + 68,
      'get', 'u30', offset + 98]
    args = args.concat(queries);
  }
  return args;
}

var buildSetQueries = function(idx, result) {
  var queries = [];
  for (let i = 0; i < result.length; i += 3) {
    var offset = (idx + (i / 3)) * bits - bits;
    var query = [
      'set', 'u29', offset + 38, result[i],
      'set', 'u30', offset + 67, result[i + 1],
      'set', 'u30', offset + 97, result[i + 2]
    ];
    queries = queries.concat(query);
  }
  return queries
}

var rebuildChunk = function(begin, sizeOfChunk) {
  var args = buildGetQueries(begin, sizeOfChunk);
  return redis.bitfield(key, args)
  .then(result => {
    return buildSetQueries(begin, result)  
  })
  .then(queries => {
    return redis.bitfield(key, queries)
  })
  .then(() => {
    return `chunk rebuilt! begin ${begin} end ${begin + sizeOfChunk}`
  })
  .catch(err => {
    return err;
  });
}

exports.areWorking = rebuilding;
exports.rebuilt = rebuilt;
exports.rebuildRedis = rebuildRedis;