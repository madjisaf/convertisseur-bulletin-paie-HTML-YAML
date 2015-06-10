var fs = require('fs');

var yaml = require('js-yaml'),
	_ = require('lodash');

var OPENFISCA_MAP_FILENAME = 'openfiscaMap.yaml',
	openfiscaMap = yaml.safeLoad(fs.readFileSync(__dirname + '/../assets/' + OPENFISCA_MAP_FILENAME)),
	defaults = yaml.safeLoad(fs.readFileSync(__dirname + '/../assets/defaults/all.yaml'));


function toOpenFisca(item) {
	var result = _.clone(item);

	result.input_variables = _.merge({}, defaults.input_variables);
	result.output_variables = _.merge({}, defaults.output_variables);

	item.data.forEach(mapRow.bind(result));

	try {
		var localDefaults = yaml.safeLoad(fs.readFileSync(__dirname + '/../assets/defaults/' + item.id + '.yaml'));

		_.merge(result, localDefaults);
	} catch (err) {
		// do nothing, there was no defaults file
	}

	delete result.data;
	delete result.id;

	return result;
}

function parseNumber(string, prefix) {
	var source = prefix || '';
	source += string;
	return Number(source.replace(' ', '').replace(',', '.'));
}

function mapRow(row) {
	if (! row.name) {
		console.error('[33mRow was not properly parsed[0m. Content can not be mapped.');
		return;
	}

	var name = cleanName(row.name);

	openfisca = openfiscaMap[name];

	if (! openfisca) {
		console.error('No mapping found for[35m', name, '[0m. Content will be dropped until you add it to', OPENFISCA_MAP_FILENAME);
		return;
	}

	if (openfisca.input) {
		this.input_variables[openfisca.input] = this.input_variables[openfisca.input] || 0;
		this.input_variables[openfisca.input] += parseNumber(row.inputAmount, openfisca.sign || '+');
	} if (openfisca.employer) {
		this.output_variables[openfisca.employer] = this.output_variables[openfisca.employer] || 0;
		this.output_variables[openfisca.employer] += parseNumber(row.employerAmount, openfisca.sign || '-');
	} if (openfisca.employee) {
		this.output_variables[openfisca.employee] = this.output_variables[openfisca.employee] || 0;
		this.output_variables[openfisca.employee] += parseNumber(row.employeeAmount, openfisca.sign || '-');
	}
}

function cleanName(name) {
	return name.replace(/(\s+\(\d+\))+\s*$/, '');
}


module.exports = {
	toOpenFisca: toOpenFisca,
	parseNumber: parseNumber,
	mapRow: mapRow,
}
