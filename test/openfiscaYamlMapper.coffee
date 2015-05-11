mapper = require '../src/openfiscaYamlMapper'


describe 'Mapper', ->
	describe 'getValue', ->
		describe 'on a base salary row', ->
			SOURCE =
				name: 'Salaire mensuel'
				positiveAmount: '12 900,00'

			it 'should return the base amount', ->
				mapper.getValue(SOURCE).should.equal 12900

		describe 'on an employer tax row', ->
			SOURCE =
				name: 'Ass. maladie-solid. autonomie sur brut'
				base: '12 900,00'
				assiette: '0,75'
				negativeAmount: '96,75'
				employerBase: '13,10'
				employerAmount: '1 689,90'

			it 'should return the employer amount', ->
				mapper.getValue(SOURCE).should.equal -1689.90
