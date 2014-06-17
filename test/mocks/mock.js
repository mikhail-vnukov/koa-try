'use strict';

var co = require('co');
var util = require('../../utils/utils.js');
var mongo = require('../../utils/mongo-utils.js');

co(function*() {
	var collection = yield mongo.connect();
	console.log('Connected to: ' + collection);
	var MAX_RUNS = 50;

	var today = util.getDateOnly(new Date());
	var ONE_DAY = 24 * 60 * 60 * 1000;

	console.log('Started filling');
	for(var i = MAX_RUNS; i > 0; i--) {
		var nextDoc = {
			_id: new Date(today - i*ONE_DAY).getTime(),
			data: Math.round(Math.random()*20 - 10)
		};
		console.log(nextDoc);
		yield collection.save(nextDoc);
	}

	yield mongo.db.close();

})();
