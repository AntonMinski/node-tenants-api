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
            phone: {
                type: String,
                unique: true,
                trim: true,
                required: true,
            },
            address: {
                type: String,
                default: '',
            },
            debt: {
                type: Number,
                default: 0,
            }
        },
    ),
    // collection
    'tenants',
);
