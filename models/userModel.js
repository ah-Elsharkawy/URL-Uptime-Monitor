const mongoose = require('mongoose');
const valid = require("validator")


let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (val) => {
                return valid.isEmail(val);
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    }
})

module.exports = mongoose.model("Users", userSchema)