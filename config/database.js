const Sequelize = require("sequelize");
require("dotenv").config();

module.exports = new Sequelize(
    process.env.DB_name,
    process.env.DB_user,
    process.env.DB_password,
    {
        
        host: "localhost",
        dialect: "mysql",
        operatorsAliases: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);
