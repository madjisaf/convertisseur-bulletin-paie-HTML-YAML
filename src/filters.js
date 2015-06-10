var fs = require('fs');

var yaml = require('js-yaml');

var POST_PROCESSING_FILENAME = 'postProcessing.yaml',
	postProcessing = yaml.safeLoad(fs.readFileSync(__dirname + '/../assets/' + POST_PROCESSING_FILENAME));


exports.postProcess = function(payroll) {
	// Warning: this function mutates the input variable "payroll".
	Object.keys(postProcessing).forEach(function(variableName) {
		var variablePostProcessing = postProcessing[variableName];

		var defaultValue = variablePostProcessing.defaultValue;
		if (defaultValue && !(variableName in payroll.input_variables)) {
			payroll.input_variables[variableName] = defaultValue;
		}
	});
	return payroll;
};
