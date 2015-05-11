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
				{
					name: 'Salaire mensuel'
					positiveAmount: '12 900,00'
				}, {
					name: 'Ass. maladie-solid. autonomie sur brut'
					base: '12 900,00'
					employeeBase: '0,75'
					employeeAmount: '96,75'
					employerBase: '13,10'
					employerAmount: '1 689,90'
				}
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

		describe 'output variables', ->
			it 'should have employer amount', ->
				actual.output_variables.should.have.property 'contribution_solidarite_autonomie'
				actual.output_variables.contribution_solidarite_autonomie.should.equal -1689.90

			it 'should have employee amount', ->
				actual.output_variables.should.have.property 'contribution_exceptionnelle_solidarite'
				actual.output_variables.contribution_exceptionnelle_solidarite.should.equal -96.75


	describe 'parseNumber', ->
		it 'should parse integers', ->
			mapper.parseNumber('12 900,00').should.equal 12900

		it 'should negate numbers if requested', ->
			mapper.parseNumber('1 689,90', '-').should.equal -1689.90
