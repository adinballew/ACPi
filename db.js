const sqlite3 = require('sqlite3').verbose();

module.exports = {
    connect: function (database) {
        return new sqlite3.Database(database, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to database.');
        });
    }
};