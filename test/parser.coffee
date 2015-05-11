parser = require '../parser'

SOURCE = __dirname + '/../item.html';

describe 'Parser', ->
	actual = parser.parse SOURCE

	it 'should parse one item', ->
		actual.should.have.length 1

	describe 'parsed item', ->
		before ->
			actual = actual[0]

		it 'should have a name', ->
			actual.name.should.equal '3 . Taux unique sur tranches B et C (n° 5382).'

		it 'should have an id', ->
			actual.id.should.equal '25005'
