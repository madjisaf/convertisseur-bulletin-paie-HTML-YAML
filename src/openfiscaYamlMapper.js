var openfiscaMap = require('../assets/openfiscaMap.json');


function toOpenFisca(item) {
	var result = item;

	result.input_variables = {};
	result.output_variables = {};

	item.data.forEach(function(row) {
		var openfisca = mapItemToOpenFisca(row);
		item[openfisca.type + '_variables'][openfisca.name] = getValue(row);
	});

	return result;
}

function getValue(row) {
	var source = '';

	if (row.positiveAmount)
		source = row.positiveAmount;

	if (row.employeeAmount)
		source = '-' + row.employeeAmount;

	if (row.employerAmount)
		source = '-' + row.employerAmount;

	return Number(source.replace(' ', '').replace(',', '.'));
}

function mapItemToOpenFisca(row) {
	return openfiscaMap[row.name]
}


module.exports = {
	toOpenFisca: toOpenFisca,
	getValue: getValue,
	mapItemToOpenFisca: mapItemToOpenFisca,
}
