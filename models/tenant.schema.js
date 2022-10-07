const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Tenant",
    new mongoose.Schema(
        {
            name: {
                type: String,
                unique: true,
                required: true,
            },
            phoneNumber: {
                type: String,
                unique: true,
                trim: true,
                required: true,
            },
            address: {
                type: String,
                default: '',
            },
            financialDebt: {
                type: Number,
                default: 0,
            }
        },
    ),
    // collection
    'tenants',
);