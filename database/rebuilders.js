const Redis = require('ioredis');
const redis = new Redis();
const params = require('./index');
const { checkNextID } = require('./databaseHelpers')

const rebuilding = false;
const rebuilt = 1;

const rebuildRedis = function(total) {
  if (rebuilt < total) {
    rebuildChunk(rebuilt);
    //implement a way to execute redis commands between chunks
  } else {
    rebuilding = false;
    return 'Database rebuilt!';
  }
}

const rebuildChunk = function(id) {
  var offset = id * params.bits;
  redis.bitfield('apartments', 
  'get', 'u29', offset + 39,
  'get', 'u30', offset + 68,
  'get', 'u30', offset + 98).then(result => {
    redis.bitfield('apartments',
    'set', 'u29', offset + 38, result[0],
    'set', 'u30', offset + 67, result[1],
    'set', 'u30', offset + 97, result[2])
  })
  .catch(err => {
    return err;
  });
}

exports.areWorking = rebuilding;
exports.position = rebuilt;
exports.rebuildRedis = rebuildRedis;