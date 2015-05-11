var fs = require('fs');

var htmlparser = require('htmlparser2');


var result,
	buffer,
	state = {
		tag: '',
		index: 0
	};

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

function setState(tag) {
	if (state.tag == tag)
		state.index += 1;
	else
		state.index = 0;

	state.tag = tag;
	state.name = tagNamesToStates[state.tag];
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

		setState(tagname);
	},
	ontext: function(text) {
		if (state.name == 'periodPerhaps' && state.index == 0) {
			var parts = text.match(/Période du (\d{2})\/(\d{2})\/(\d{4})/);
			if (parts)
				buffer.period = 'month:' + parts[3] + '-' + parts[2];
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
