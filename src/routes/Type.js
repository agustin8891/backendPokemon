const { Router } = require('express');
const router = Router();
const {Type} = require ('../db')
const axios = require('axios')


router.get('/', async(req, res) => {  
	const TypesApi = await axios.get('https://pokeapi.co/api/v2/type')
 	const Types = TypesApi.data.results.map(el => el.name)
	const TypesEach = Types.map(el => {
		for (let i=0; i<el.length; i++) {
			return el
		}
	})
	TypesEach.forEach(el => {
		Type.findOrCreate({
			where: {name: el}
		})
	})
	const AllTypes = await Type.findAll();
	res.send(AllTypes);
})

module.exports = router;