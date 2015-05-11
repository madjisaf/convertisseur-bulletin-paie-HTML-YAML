var openfiscaMap = require('../assets/openfiscaMap.json');


function toOpenFisca(item) {
	var result = item;

	result.input_variables = {};
	result.output_variables = {};

	item.data.forEach(mapRow.bind(result));

	return result;
}

function parseNumber(string, prefix) {
	var source = prefix || '';
	source += string;
	return Number(source.replace(' ', '').replace(',', '.'));
}

function mapRow(row) {
	openfisca = openfiscaMap[row.name];

	if (! openfisca)
		throw new ReferenceError('No mapping found for "' + row.name + '". Please add it to ' + OPENFISCA_MAP_FILENAME);

	if (openfisca.input)
		this.input_variables[openfisca.input] = parseNumber(row.positiveAmount);
	if (openfisca.employer)
		this.output_variables[openfisca.employer] = parseNumber(row.employerAmount, '-');
	if (openfisca.employee)
		this.output_variables[openfisca.employee] = parseNumber(row.employeeAmount, '-');
}


module.exports = {
	toOpenFisca: toOpenFisca,
	parseNumber: parseNumber,
	mapRow: mapRow,
}
