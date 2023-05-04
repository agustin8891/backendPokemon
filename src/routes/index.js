const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokemonRoute = require('./Pokemon')
const typesRoute=require('./Type')


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/pokemons', pokemonRoute);
router.use('/types', typesRoute);


module.exports = router;