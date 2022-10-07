const Schema = require('../models/tenant.schema');
const express = require('express');
const router = express.Router();

// Create and Save a new Tenant
const create = (req, res) => {
    console.log(req.body);

    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Tenant
    const tenant = new Schema({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        financialDebt: req.body.financialDebt
    });

    // Save Tenant in the database
    tenant
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tenant."
            });
        });
};

// Retrieve all Tenants from the database.
const findAll = (req, res) => {
    Schema.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tenants."
            });
        });
};

// Find a single Tenant with an id
const findOne = (req, res) => {
    const id = req.params.id;

    Schema.findById(id)
        .then((data) => {
            if(!data) {
                return res.status(404).send({ message: 'tenant with ID ' + req.params.id + ' hasn\'t been found. Please check the ID' });
            }
            return res.status(200).send(data);
        })
        .catch((err) => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({ message: 'tenant with ID ' + req.params.id + ' hasn\'t been found ' });
            }
            return res.status(500).send({ message: 'error retrieving data with id ' + req.params.id });
        });
};

// Update a Tenant by the id in the request
const update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Schema.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tenant with id=${id}. Maybe Tenant was not found!`
                });
            } else res.send({ message: "Tenant was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tenant with id=" + id
            });
        });
};

// Delete a Tenant with the specified id in the request
const deleteOne = (req, res) => {
    const id = req.params.id;

    Schema.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tenant with id=${id}. Maybe Tenant was not found!`
                });
            } else {
                res.send({
                    message: "Tenant was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tenant with id=" + id
            });
        });
};

// Delete all Tenants from the database.
const deleteAll = (req, res) => {
    Schema.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tenants were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tenants."
            });
        });
};

// Find all Tenants with debts
const findAllDebts = (req, res) => {
    Schema.find({ financialDebt: { $gt: 0 } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tenants."
            });
        });
};

// Find all Tenants that do not have any debt.
const findNoDebts = (req, res) => {
    Schema.find({ financialDebt: 0 })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tenants."
            });
        });
};

// Create a new Tenant
router.post("/", create);

// Retrieve all Tenants
router.get("/", findAll);

// Update a Tenant with id
router.put("/:id", update);

// Delete a Tenant with id
router.delete("/:id", deleteOne);

// Delete all Tenants
router.delete("/", deleteAll);

// Retrieve Tenants with debts
router.get("/debts", findAllDebts);

// Tenants with no debts
router.get("/no-debts", findNoDebts);

// Retrieve a single Tenant with id
router.get("/:id", findOne);

module.exports = router;
