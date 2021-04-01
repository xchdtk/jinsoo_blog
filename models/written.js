'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Written extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Written.init(
        {
            writtenId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
            },
            image_url: DataTypes.STRING,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Written',
        }
    )
    return Written
}
