#!/bin/env node


var fs = require('fs'),
	path = require('path');

var yaml = require('js-yaml');

var parser = require('./src/parser'),
	mapper = require('./src/openfiscaMapper'),
	filters = require('./src/filters');

var SOURCE = path.join(__dirname, '/assets/source.html'),
	TARGET_DIR = path.join(__dirname, '/dist');

var requestedPayrolls = Array.prototype.slice.call(process.argv, 2);

try {
	fs.mkdirSync(TARGET_DIR);
} catch (err) {
	// do nothing: folder most probably already exists
	// if it doesn't, all subsequent writes will complain anyway
}


var payrolls = parser.parse(fs.readFileSync(SOURCE));

if (requestedPayrolls.length) {
	payrolls = payrolls.filter(function(payroll) {
		return requestedPayrolls.indexOf(payroll.id) > -1;
	});
}

payrolls.forEach(function(payroll) {
	  	var targetPath = path.join(TARGET_DIR, payroll.id + '.yaml');

			// Convert original payroll to OpenFisca variable names.
			var convertedPayroll = mapper.toOpenFisca(payroll);

			// Fix sign and set default value for some variables (see README).
			convertedPayroll = filters.postProcess(convertedPayroll);

	  	fs.writeFile(targetPath, yaml.safeDump(convertedPayroll), function(err) {
	  		if (err)
	  			throw err;

	  		console.log('Wrote file', targetPath);
	  	});
	  });
