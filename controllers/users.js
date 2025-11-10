const mongodb = require('../data/database');
const ObjectID = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db('project1').collection('users').find();
        const users = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        console.error('❌ Error en getAll:', error);
        res.status(500).json({ error: 'Error fetching users', message: error.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const userID = new ObjectID(req.params.id);
        const result = await mongodb.getDatabase().db('project1').collection('users').find({ _id: userID });
        const users = await result.toArray();
        
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0]);
    } catch (error) {
        console.error('❌ Error en getSingle:', error);
        res.status(500).json({ error: 'Error fetching user', message: error.message });
    }
};

module.exports = {
    getAll,
    getSingle
};