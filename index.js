#!/bin/env node


var fs = require('fs');

var yaml = require('js-yaml');

var parser = require('./src/parser'),
	mapper = require('./src/openfiscaMapper');

var SOURCE = __dirname + '/assets/source.html';

parser.parse(fs.readFileSync(process.argv[2] || SOURCE))
	  .forEach(function(payroll) {
		console.log(yaml.safeDump(mapper.toOpenFisca(payroll)));
	  });
