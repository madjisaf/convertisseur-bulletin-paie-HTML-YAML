#!/bin/env node


var fs = require('fs'),
	path = require('path');

var yaml = require('js-yaml');

var parser = require('./src/parser'),
	mapper = require('./src/openfiscaMapper');

var SOURCE = path.join(__dirname, '/assets/source.html'),
	TARGET_DIR = path.join(__dirname, '/dist');


try {
	fs.mkdirSync(TARGET_DIR);
} catch (err) {
	// do nothing: folder most probably already exists
	// if it doesn't, all subsequent writes will complain anyway
}

parser.parse(fs.readFileSync(process.argv[2] || SOURCE))
	  .forEach(function(payroll) {
	  	var targetPath = path.join(TARGET_DIR, payroll.id + '.yaml');

	  	fs.writeFile(targetPath, yaml.safeDump(mapper.toOpenFisca(payroll)), function(err) {
	  		if (err)
	  			throw err;

	  		console.log('Wrote file', targetPath);
	  	});
	  });
