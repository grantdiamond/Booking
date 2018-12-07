const params = require('./index');
const rebuilders = require('./rebuilders')

exports.get = function(id) {
  let bits = params.bits;
  var offset = (id * bits) - bits;
  var subOffsets = [13, 17, 22, 28, 38, 68, 98];
  if (!rebuilders.areWorking || 
    (rebuilders.areWorking && rebuilders.position > id)) {
    return [
      'get', 'u13', offset,
      'get', 'u4',  offset + subOffsets[0],
      'get', 'u5',  offset + subOffsets[1],
      'get', 'u6',  offset + subOffsets[2],
      'get', 'u10', offset + subOffsets[3],
      'get', 'u30', offset + subOffsets[4],
      'get', 'u30', offset + subOffsets[5],
      'get', 'u30', offset + subOffsets[6],
    ]
  } else {
    return [
      'get', 'u13', offset,
      'get', 'u4',  offset + subOffsets[0],
      'get', 'u5',  offset + subOffsets[1],
      'get', 'u6',  offset + subOffsets[2],
      'get', 'u10', offset + subOffsets[3],
      'get', 'u29', offset + subOffsets[4],
      'get', 'u30', offset + subOffsets[5],
      'get', 'u30', offset + subOffsets[6],
    ]
  }
};

