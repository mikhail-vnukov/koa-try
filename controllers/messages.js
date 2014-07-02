'use strict';

var parse = require('co-body');
var co = require('co');
//var mongo = require('../utils/mongo-utils.js');
var comongo = require('co-mongo');

var collection;
co(function*() {
	var db = yield comongo.connect('mongodb://127.0.0.1:27017/test');
	collection = yield db.collection('dots');
})();


module.exports.list = function *list() {
	this.body = yield collection.find().toArray();
};

module.exports.fetch = function *fetch() {
	var id = parseInt(this.params.id);
	console.log('Dot: ' + id);

	this.body = yield collection.findOne({_id: id});

	if (!this.body) {
		this.throw(404, 'message with id = ' + id + ' was not found');
	}
};

module.exports.create = function *create() {
	var id = parseInt(this.params.id);
	if(!id) {
		this.throw(400, 'Need to define id');
	}
	var body = yield parse.json(this);
	yield collection.save({ _id: id, data: body});

	this.response.body = 'OK';
};
