require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_URL } = process.env;
const axios = require("axios");
require("pg");

const sequelize = new Sequelize(DB_URL, {
  logging: false,
  native: false,
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Pokemon, Type } = sequelize.models;

//relaciones

Pokemon.belongsToMany(Type, { through: "Pokemon_Type" });
Type.belongsToMany(Pokemon, { through: "Pokemon_Type" });


// lleno la tabla "Types"
// (async function () {
//   const TypesApi = await axios.get("https://pokeapi.co/api/v2/type");
//   const Types = TypesApi.data.results.map((el) => el.name);
//   const TypesEach = Types.map((el) => {
//     for (let i = 0; i < el.length; i++) {
//       return el;
//     }
//   });
//   TypesEach.forEach((el) => {
//     Type.findOrCreate({
//       where: { name: el },
//     });
//   });
// })();




module.exports = {
  ...sequelize.models,
  conn: sequelize, 
};
