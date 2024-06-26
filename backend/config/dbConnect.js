
const mongoose = require('mongoose');

function connection(URI) {
    return mongoose.connect(URI);
};

module.exports = connection;