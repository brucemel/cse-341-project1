const mongodb = require('../data/database')
const ObjectID = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('users').find();
    result.toArray().then((Users) => {
        res.setHeader('content-Type', 'application/json');
        res.status(200).json(Users);
    });
};

const getSingle = async (req, res) => {
    const userID = new ObjectID(req.params.id);
    const result = await mongodb.getDatabase().db().collection('users').find({_id: userID});
    result.toArray().then((Users) => {
        res.setHeader('content-Type', 'application/json');
        res.status(200).json(Users[0]);
    });
};

module.exports = {
    getAll,
    getSingle
}