const Schema = require('../models/user.schema');
const express = require('express');
const router = express.Router();


// retrieve all user data from the DB
const find = (req, res) => {
    Schema.find()
    .then((data) => {
        return res.status(200).send(data);
    })
    .catch((err) => {
        return res.status(500).send({
            message:
            err.message || 'some error ocurred while retrieving data.',
        });
    });
};

// get and find a single user data with id
const findById = (req, res) => {
    Schema.findById({_id:req.params.id})
    .then((data) => {
        if(!data) {
            return res.status(404).send({ message: 'data not found with id ' + req.params.id + '. Make sure the id was correct' });
        }
        return res.status(200).send(data);
    })
    .catch((err) => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({ message: 'data not found with id ' + req.params.id });
        }
        return res.status(500).send({ message: 'error retrieving data with id ' + req.params.id });
    });
}

// update a user data identified by the  id in the request
const findOneAndUpdate = (req, res) => {
    console.log(req.body);
    Schema.findById({_id:req.params.id})
    .then((currentData) => {
        let {newName, newEmail, newPassword } = '';
        if (!req.body.name) { newName = currentData.name}
        if (!req.body.email) { newEmail = currentData.email}
        if (!req.body.password) { newPassword = currentData.password}
        if (req.body.name) { newName = req.body.name}
        if (req.body.email) { newEmail = req.body.email}
        if (req.body.password) { newPassword = req.body.password}
        const newData = Schema({
            name: newName,
            email: newEmail,
            password: newPassword,
            _id: req.params.id
        });
        // update with new data
        Schema.findByIdAndUpdate( {_id: req.params.id}, newData, { new: true } )
        .then((updatedData) => {
            return res.status(200).send(updatedData);
        }).catch((err) => {
            if(err.kind === 'Object_id') {
                return res.status(404).send({ message: 'data not found with _id ' + req.params._id, });
            }
            return res.status(500).send({ message: 'error updating data with _id ' + req.params._id, });
        });
    })
    .catch((err) => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({ message: 'data not found with id ' + req.params.id });
        }
        return res.status(500).send({ message: 'error retrieving data with id ' + req.params.id });
    });
};

// delete a user data with the specified id
const findByIdAndRemove = (req, res) => {
    Schema.findByIdAndRemove({_id: req.params.id})
    .then((data) => {
        if(!data) { return res.status(404).send({ message: 'data not found with id ' + req.params.id, }); }
        return res.status(200).send({ message: 'data deleted successfully!' });
    })
    .catch((err) => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({ message: 'data not found with id ' + req.params.id, });
        }
        return res.status(500).send({ message: 'could not delete data with id ' + req.params.id, });
    });
};

// delete all user data in collection
const remove = (req, res) => {
    Schema.remove({})
    .then(() => { return res.status(200).send({ message: 'All data deleted successfully!' }); }) 
    .catch((err) => { return res.status(500).send({ message: 'Could not delete all data' }); })
}

router.get('/', find);
// read user data by id
router.get('/:id', findById);
// update user data by id
router.put('/:id', findOneAndUpdate);
// delete user data by id
router.delete('/:id', findByIdAndRemove);
// delete all user data
router.delete('/', remove);

module.exports = router;