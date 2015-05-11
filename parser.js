var fs = require('fs');

var htmlparser = require('htmlparser2');

var SOURCE = './source.html';

var parsed,
	state;

function store(parsed) {
	console.log(parsed);
}

function init() {
	parsed = {};
}

function setState(targetState) {
	state = targetState;
}

function currentState() {
	return state;
}


var parser = new htmlparser.Parser({
	onopentag: function(tagname, attribs) {
		if (tagname == 'h3') {
			init();
			setState('name');
		}
	},
	ontext: function(text) {
		parsed[currentState()] = parsed[currentState()] || '';
		parsed[currentState()] += text;
	},
	onclosetag: function(tagname) {
		if (tagname == 'h3') {
			store(parsed);
		}
	}
}, { decodeEntities: true });


init();
parser.write(fs.readFileSync(SOURCE));
parser.end();
