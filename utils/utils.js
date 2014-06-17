'use strict';


module.exports.getDateOnly = function(date) {
	return date.getTime()-date.getTime()%(1000*60*60*24);
};
