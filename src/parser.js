var fs = require('fs');

var htmlparser = require('htmlparser2');


var result,
	buffer,
	state;

function store() {
	result.push(deepTrim(buffer));
}

function deepTrim(object) {
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			switch (typeof object[key]) {
				case 'string':
					object[key] = object[key].replace(/\s+/g, ' ').trim();
					break;
				case 'object':
					object[key] = deepTrim(object[key]);
					break;
			}
		}
	}

	return object;
}

function init() {
	result = [];
	buffer = {};
	state = {
		tag: '',
		previous: undefined,
		name: 'root'
	}
}

function setState(tag) {
	state.tag = tag;

	var nextState = currentStateAndTagNameToNextState[state.name] && currentStateAndTagNameToNextState[state.name][state.tag];
	if (nextState) {
		state.previous = state.name;
		state.name = nextState;
	}
}


var currentStateAndTagNameToNextState = {
	root: { h3: 'name' },
	name: { dt: 'id' },
	id: { dd: 'description' },
	description: { strong: 'period' },
	period: { tbody: '_malformedHeader' },
	_malformedHeader: { tbody: 'payroll' },
	payroll: { tr: 'tax' },
	tax: { td: 'tax.name' },
	'tax.name': { td: 'tax.base' },
	'tax.base': { td: 'tax.assiette' },
	'tax.assiette': { td: 'tax.positiveAmount' },
	'tax.positiveAmount': { td: 'tax.negativeAmount' },
	'tax.negativeAmount': { td: '_separationColumn' },
	_separationColumn: { td: 'tax.employerBase' },
	'tax.employerBase': { td: 'tax.employerAmount' },
	'tax.employerAmount': {
		tr: 'tax',
		h3: 'name',
	},
}


var parser = new htmlparser.Parser({
	onopentag: function(tagname, attribs) {
		if (tagname == 'h3' && state.name != 'root')
			store();

		setState(tagname);
	},
	ontext: function(text) {
		if (state.name == 'period') {
			var parts = text.match(/Période du (\d{2})\/(\d{2})\/(\d{4})/);
			if (parts)
				buffer.period = 'month:' + parts[3] + '-' + parts[2];
		} else if (state.name == 'payroll') {
			buffer.data = [];
		} else if (state.name == 'tax') {
			buffer.data[buffer.data.length] = {};
		} else if (state.name.match(/tax\./)) {
			var property = state.name.match(/tax\.(.+)/)[1];
			buffer.data[buffer.data.length - 1][property] = buffer.data[buffer.data.length - 1][property] || '';
			buffer.data[buffer.data.length - 1][property] += text;
		} else if (state.name.indexOf('_') == 0) {	// underscore-prefixed states are garbage
			return;
		} else {
			buffer[state.name] = buffer[state.name] || '';
			buffer[state.name] += text;
		}
	},
	onclosetag: function(tagname) {
	}
}, { decodeEntities: true });



exports.parse = function parse(filePath) {
	init();
	parser.write(fs.readFileSync(filePath || process.env.argv[2]));
	parser.end();
	store();

	return result;
}
