mapper = require '../src/openfiscaYamlMapper'


describe 'Mapper', ->
	describe 'OpenFisca object', ->
		NAME	= '3 . Taux unique sur tranches B et C (n° 5382).'
		ID		= '25005'
		PERIOD	= 'month:2015-01'
		SOURCE	=
			name	: NAME
			id		: ID
			period	: PERIOD
			data	: [
				name: 'Salaire mensuel'
				positiveAmount: '12 900,00'
			]

		actual = mapper.toOpenFisca SOURCE

		it 'should have a name', ->
			actual.name.should.equal NAME

		it 'should have an id', ->
			actual.id.should.equal ID

		it 'should have a period', ->
			actual.period.should.equal PERIOD

		it 'should have input variables', ->
			actual.input_variables.should.have.property 'salaire_de_base'
			actual.input_variables.salaire_de_base.should.equal 12900

	describe 'parseNumber', ->
		it 'should parse integers', ->
			mapper.parseNumber('12 900,00').should.equal 12900

		it 'should negate numbers if requested', ->
			mapper.parseNumber('1 689,90', '-').should.equal -1689.90
