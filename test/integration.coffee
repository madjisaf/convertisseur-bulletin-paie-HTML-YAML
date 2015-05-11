fs = require 'fs'

parser = require '../src/parser'

SOURCE = __dirname + '/../assets/source.html';

describe 'Parser on full text', ->
	actual = parser.parse fs.readFileSync SOURCE

	it 'should parse all payrolls', ->
		actual.should.have.length 83
