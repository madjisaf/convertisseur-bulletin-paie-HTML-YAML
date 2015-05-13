var htmlparser = require('htmlparser2');

var deepTrim = require('../lib/deepTrim.js');


var result,
	buffer,
	state,
	debug = {};

function store() {
	if (process.env.DEBUG)
		buffer.index = debug.h3;

	result.push(deepTrim(buffer));
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

	var nextState = currentStateAndTagNameToNextState['*'][state.tag]
		|| (   currentStateAndTagNameToNextState[state.name]
			&& currentStateAndTagNameToNextState[state.name][state.tag]);
	if (nextState) {
		state.previous = state.name;
		state.name = nextState;
	}
}


var currentStateAndTagNameToNextState = {
	'*'						: { h3		: 'name'				},
	name					: { dt		: 'id'					},
	id						: { dd		: 'description'			},
	description				: { strong	: 'period'				},
	period					: { tbody	: '_malformedHeader'	},
	_malformedHeader		: { tbody	: 'payroll'				},
	payroll					: { tr		: 'tax'					},
	tax						: { td		: 'tax.name'			},
	'tax.name'				: { td		: 'tax.base'			},
	'tax.base'				: { td		: 'tax.employeeBase'	},
	'tax.employeeBase'		: { td		: 'tax.positiveAmount'	},
	'tax.positiveAmount'	: { td		: 'tax.employeeAmount'	},
	'tax.employeeAmount'	: { td		: '_separationColumn'	},
	_separationColumn		: { td		: 'tax.employerBase'	},
	'tax.employerBase'		: { td		: 'tax.employerAmount'	},
	'tax.employerAmount'	: { tr		: 'tax'					},
};

var stateHandlers = [
	{
		name: 'period',
		handler: function(text) {
			var parts = text.match(/Période du (\d{2})\/(\d{2})\/(\d{4})/);
			if (parts)
				buffer.period = 'month:' + parts[3] + '-' + parts[2];
		}
	},
	{
		name: 'payroll',
		handler: function(text) {
			buffer.data = [];
		}
	},
	{
		name: 'tax',
		handler: function(text) {
			buffer.data[buffer.data.length] = {};
		}
	},
	{
		regexp: /^tax\./,
		handler: function(text) {
			var property = state.name.match(/tax\.(.+)/)[1];
			buffer.data[buffer.data.length - 1][property] = buffer.data[buffer.data.length - 1][property] || '';
			buffer.data[buffer.data.length - 1][property] += text;
		}
	},
	{
		regexp: /^_/,
		handler: function(text) {
			// underscore-prefixed states are garbage, throw content away
		}
	}
];

function handles(text) {
	return function(stateHandler) {	// currying for iteration
		if (stateHandler.name == state.name
			|| (stateHandler.regexp && stateHandler.regexp.exec(state.name))) {
			stateHandler.handler(text);
			return true;
		}
	}
}


var parser = new htmlparser.Parser({
	onopentag: function(tagname, attribs) {
		if (tagname == 'h3' && state.name != 'name') {
			if (state.name != 'root')
				store();

			buffer = {};
		}

		setState(tagname);

		if (process.env.DEBUG) {
			var tagCount = debug[tagname] || 0;
			tagCount++;

			console.error('<' + tagname + '>\t\t' + state.name + '\t\t' + tagCount);
			debug[tagname] = tagCount;
		}
	},
	ontext: function(text) {
		if (! stateHandlers.some(handles(text))) {
			buffer[state.name] = buffer[state.name] || '';
			buffer[state.name] += text;
		}
	},
	onclosetag: function(tagname) {
	}
}, { decodeEntities: true });



exports.parse = function parse(data) {
	init();
	parser.write(data);
	parser.end();
	store();

	if (process.env.DEBUG) {
		console.error('Parsed', debug);
	}

	return result;
}
