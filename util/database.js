// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Maithuhuyen5893@'
// });

// module.exports = pool.promise();

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', 'Maithuhuyen5893@', {
//         dialect: 'mysql', 
//         host: 'localhost'
// });

// module.exports = sequelize;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
        const mongoDatabaseLink = 'mongodb+srv://DaiNguyen:Maithuhuyen5893@cluster0.wzqosae.mongodb.net/?retryWrites=true&w=majority';
        MongoClient.connect(mongoDatabaseLink)
                .then(client => {
                        console.log('Connected');
                        callback(client)
                })
                .catch(err => console.log(err));
};

module.exports = mongoConnect;