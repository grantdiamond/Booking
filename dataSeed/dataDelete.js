const knexPG = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    database: 'booking'
  }
});

var deletePostGRData = function() {
  return knexPG('bookings')
    .del()
    .then(() => {
      console.log('data deleted from bookings table in postgres');
      return knexPG('bookingOneColumn')
        .del()
        .then(() => {
          console.log('data deleted from bookingOneColumn table in postgres');
        });
    });
};

deletePostGRData();

const knexMySQL = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    database: 'booking',
    user: 'root',
    password: ''
  }
});

var deleteMYSQL = function() {
  return knexMySQL('dates')
    .del()
    .then(() => {
      console.log('data deleted from dates table in mysql');
      return knexMySQL('apartment')
        .del()
        .then(() => {
          console.log('data deleted from apartment table in mysql');
        });
    });
}

deleteMYSQL();

const redis = require('redis');
client = redis.createClient();

client.flushdb( function (err, succeeded) {
  if (succeeded) {
    console.log('redis data deleted!')
  } else {
    console.log('redis data did not delete')
  }
});