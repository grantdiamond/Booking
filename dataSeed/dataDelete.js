const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    database: 'booking'
  }
});

var deleteData = function() {
  return knex('bookings').del()
  .then(() => {
    console.log('data deleted')
  });
};

deleteData();