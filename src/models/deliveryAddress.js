const mongoose = require("mongoose");
const validator = require("validator");
const Users = require("./Users");

const deliveryAddressSchema = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    phone: {
        type: String,
        required: true
    },
    secondaryPhone: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    message: String,
    location: String,
}
const DeliveryAddress = mongoose.model("DeliveryAddress", deliveryAddressSchema);
module.exports = DeliveryAddress