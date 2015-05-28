var fs = require('fs');

var yaml = require('js-yaml');

var OPENFISCA_MAP_FILENAME = 'openfiscaMap.yaml',
	openfiscaMap = yaml.safeLoad(fs.readFileSync(__dirname + '/../assets/' + OPENFISCA_MAP_FILENAME));


function toOpenFisca(item) {
	var result = item;

	result.input_variables = {};
	result.output_variables = {};

	item.data.forEach(mapRow.bind(result));

	delete item.data;

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
		this.input_variables[openfisca.input] += parseNumber(row.positiveAmount);
	} if (openfisca.employer) {
		this.output_variables[openfisca.employer] = this.output_variables[openfisca.employer] || 0;
		this.output_variables[openfisca.employer] += parseNumber(row.employerAmount, '-');
	} if (openfisca.employee) {
		this.output_variables[openfisca.employee] = this.output_variables[openfisca.employee] || 0;
		this.output_variables[openfisca.employee] += parseNumber(row.employeeAmount, '-');
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
