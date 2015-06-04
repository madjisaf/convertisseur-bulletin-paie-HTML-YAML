var fs = require('fs');

var yaml = require('js-yaml');

var POST_PROCESSING_FILENAME = 'postProcessing.yaml',
	postProcessing = yaml.safeLoad(fs.readFileSync(__dirname + '/../assets/' + POST_PROCESSING_FILENAME));


exports.postProcess = function(payroll) {
  // Warning: this function mutates the input variable "payroll".
  Object.keys(postProcessing).forEach(function(variableName) {
    var variablePostProcessing = postProcessing[variableName];

    // Change sign if needed.
    var sign = variablePostProcessing.sign;
    if (sign) {
      if (sign !== "positive" && sign !== "negative") {
        throw new Error("sign value must be \"positive\" or \"negative\", see variable \"" + variableName +
          "\" in file \"" + postProcessing + "\"");
      }
      if (variableName in payroll.output_variables) {
        var value = payroll.output_variables[variableName];
        if (sign === "positive" && value < 0 || sign === "negative" && value > 0) {
          payroll.output_variables[variableName] = -value;
        }
      }
    }

    var defaultValue = variablePostProcessing.defaultValue;
    if (defaultValue && !(variableName in payroll.output_variables)) {
      payroll.output_variables[variableName] = defaultValue;
    }
  });
  return payroll;
};
