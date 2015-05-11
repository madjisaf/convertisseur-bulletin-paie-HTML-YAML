var fs = require('fs');

var htmlparser = require('htmlparser2');


var result,
	buffer,
	state;

function store() {
	for (var key in buffer)
		if (buffer.hasOwnProperty(key))
			buffer[key] = buffer[key].trim();

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
	dt: 'id',
	dd: 'description',
	strong: 'periodPerhaps'
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
		if (currentState() == 'periodPerhaps') {
			var parts = text.match(/Période du (\d{2})\/(\d{2})\/(\d{4})/);
			if (parts)
				buffer.period = 'month:' + parts[3] + '-' + parts[2];
		} else {
			buffer[currentState()] = buffer[currentState()] || '';
			buffer[currentState()] += text;
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
