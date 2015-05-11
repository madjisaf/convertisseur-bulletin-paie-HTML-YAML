var fs = require('fs');

var htmlparser = require('htmlparser2');


var result,
	buffer,
	state;

function store() {
	result.push(buffer);
}

function init() {
	result = [];
	buffer = {};
}

function setState(targetState) {
	state = targetState;
}

function currentState() {
	return state;
}

var tagNamesToStates = {
	h3: 'name',
	dt: 'id'
}


var parser = new htmlparser.Parser({
	onopentag: function(tagname, attribs) {
		if (tagname == 'h3') {
			store();
			init();
		}

		setState(tagNamesToStates[tagname]);
	},
	ontext: function(text) {
		buffer[currentState()] = buffer[currentState()] || '';
		buffer[currentState()] += text;
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
