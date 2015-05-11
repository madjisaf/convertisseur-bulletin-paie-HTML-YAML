var openfiscaMap = require('../assets/openfiscaMap.json');


function toOpenFisca(item) {
	var result = item;

	result.input_variables = {};
	result.output_variables = {};

	item.data.forEach(function(row) {
		var openfisca = mapItemToOpenFisca(row);

		if (openfisca.input)
			result.input_variables[openfisca.input] = parseNumber(row.positiveAmount);
		else if (openfisca.employer)
			result.output_variables[openfisca.employer] = parseNumber(row.employerAmount, '-');
		else if (openfisca.employee)
			result.output_variables[openfisca.employee] = parseNumber(row.employeeAmount, '-');
	});

	return result;
}

function parseNumber(string, prefix) {
	var source = prefix || '';
	source += string;
	return Number(source.replace(' ', '').replace(',', '.'));
}

function mapItemToOpenFisca(row) {
	return openfiscaMap[row.name]
}


module.exports = {
	toOpenFisca: toOpenFisca,
	parseNumber: parseNumber,
	mapItemToOpenFisca: mapItemToOpenFisca,
}
