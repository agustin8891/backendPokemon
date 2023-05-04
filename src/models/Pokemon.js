const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
	id: {
    		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		primaryKey: true
	},image: {
		type: DataTypes.STRING,
		allowNull: true,
	},name: {
      		type: DataTypes.STRING,
      		allowNull: false,
    	},life: {
      		type: DataTypes.REAL,
      		allowNull: true,
    	},attack: {
      		type: DataTypes.REAL,
      		allowNull: true,
   	 },defense: {
      		type: DataTypes.REAL,
      		allowNull: true,
    	},speed: {
      		type: DataTypes.REAL,
      		allowNull: true,
    	},height: {
      		type: DataTypes.REAL,
      		allowNull: true,
    	},weight: {
      		type: DataTypes.REAL,
      		allowNull: true,
   	 },createdInDb: {
	        type: DataTypes.BOOLEAN,
	        allowNull: false,
        	defaultValue: true,
	},	
  }, {timestamps: false});
};