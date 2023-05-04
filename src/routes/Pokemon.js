const { Router } = require('express');
const router = Router();
const axios = require('axios')
const {Pokemon, Type} = require('../db')
const {Op} = require('sequelize')



const getApiInfo = async() => { 

    const apiUrl = await axios.get('https://pokeapi.co/api/v2/pokemon') 
	const urlNext = await axios.get(apiUrl.data.next)
	const pokemons = apiUrl.data.results.concat(urlNext.data.results) 	
	const apiInfo = await Promise.all(pokemons.map(async(object) => {
		let p = await axios(object.url)
		return {			
			id: p.data.id,
			name: p.data.name,
			life: p.data.stats[0].base_stat,
			attack: p.data.stats[1].base_stat,
			defense: p.data.stats[2].base_stat,
			speed: p.data.stats[5].base_stat,
			height: p.data.height,
			weight: p.data.weight,
			image: p.data.sprites.other.home.front_default,
			types: p.data.types.map(t=>t.type.name)
		}
	}
	))	
	return apiInfo

}

const getDbInfo = async() => {
	let r=await Pokemon.findAll({
		include: {
			model:Type,
			attributes: ['name'],
			through:{
				attributes: [],
				},
			},
		});
		r=r.map((e) => ({...e.dataValues, types: e.types.map((e) => e.name)}));
		console.log(r)
	return r;
	};

	

const getAllCharacters = async() => {
	const apiInfo = await getApiInfo();	
	const dbInfo = await getDbInfo();
	const infoTotal = apiInfo.concat(dbInfo);
	return infoTotal
}

router.get('/', async (req,res) => {
	const name= req.query.name
    let pokemon
	if(name) {
				try {
                    //Busco en la Bd
                    let PokemonsDb = await getDbInfo()               
                        pokemon = PokemonsDb.filter(function(el) {
                    return el.name.toLowerCase() === name.toLowerCase() })
				if(!pokemon.length) {
                    // Busco en la api
					nameMinuscula=name.toLowerCase()
					const buscarNombreApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameMinuscula}`)
					pokemon = {
										id: buscarNombreApi.data.id,
										name: buscarNombreApi.data.name,
										life: buscarNombreApi.data.stats[0].base_stat,
										attack: buscarNombreApi.data.stats[1].base_stat,
										defense: buscarNombreApi.data.stats[2].base_stat,
										speed: buscarNombreApi.data.stats[5].base_stat,
										height: buscarNombreApi.data.height,
										weight: buscarNombreApi.data.weight,
										image: buscarNombreApi.data.sprites.other.home.front_default,
										types: buscarNombreApi.data.types.map(t=>t.type.name)						
									}
									res.status(200).send([pokemon]) 		
				} else { 
						res.status(200).send(pokemon) 							
					}
					}
					catch(err) {
						res.status(404).send(err)
					} 
				} else {
		let pokemonsAll= await getAllCharacters();
		res.status(200).send(pokemonsAll)        
	}

})

router.get('/:id', async (req,res) => {
	try {	
		const id = req.params.id;

		let pokemon
		if(typeof id === 'string' && id.length > 8) {            
               let PokemonsDb = await getDbInfo()               
                pokemon = PokemonsDb.filter(function(el) {
	            return el.id === id; })
 
				res.send(pokemon[0])                            
		} else {
			buscarIdApi= await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
			pokemon = {
				id: buscarIdApi.data.id,
				name: buscarIdApi.data.name,
				life: buscarIdApi.data.stats[0].base_stat,
				attack: buscarIdApi.data.stats[1].base_stat,
				defense: buscarIdApi.data.stats[2].base_stat,
				speed: buscarIdApi.data.stats[5].base_stat,
				height: buscarIdApi.data.height,
				weight: buscarIdApi.data.weight,
				image: buscarIdApi.data.sprites.other.home.front_default,
				types: buscarIdApi.data.types.map(t=>t.type.name)									
			}
			res.send(pokemon)	
		}	
		} catch(error) {
			res.status(404).send(error)
		}	
	})


router.post('/', async (req,res) => {
	let {
		name,
		life,
		attack,
		defense,
		speed,
		height,
		weight,
		image,
		types,
	}= req.body	
	let pokemonCreado = await Pokemon.create({
		name,
		life,
		attack,
		defense,
		speed,
		height,
		weight,
		image,
	})
	let TypeBd = await Type.findAll({
		where: {name : types}			
	})
	pokemonCreado.addType(TypeBd)
	res.send('Pokemon creado con éxito')
})


module.exports = router;