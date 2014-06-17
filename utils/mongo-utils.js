'use strict';

var comongo = require('co-mongo');

module.exports.connect = function*() {
	var db = yield comongo.connect('mongodb://127.0.0.1:27017/test');
	module.exports.db = db;
	return yield db.collection('dots');
};


