var openfiscaMap = require('../assets/openfiscaMap.json');

module.exports = {
	mapToOpenFiscaYaml: function mapToOpenFiscaYaml(item) {

	},

	mapToOpenFisca: function mapToOpenFisca(item) {
		var result = item;

		result.input_variables = {};
		result.output_variables = {};

		item.data.forEach(function(row) {
			var openfisca = mapItemToOpenFisca(row);
			item[openfisca.type + '_variables'][openfisca.name] = getValue(row);
		});
	},

	getValue: function getValue(row) {
		var source = '';

		if (row.positiveAmount)
			source = row.positiveAmount;

		if (row.negativeAmount)
			source = '-' + row.negativeAmount;

		if (row.employerAmount)
			source = '-' + row.employerAmount;

		return Number(source.replace(' ', '').replace(',', '.'));
	},

	mapItemToOpenFisca: function mapItemToOpenFisca(row) {
		return openfiscaMap[row.name]
	}
}
