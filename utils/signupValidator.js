const Ajv = require('ajv');
const ajv = new Ajv();

// registration(Sign up) schema
const schema = {
    "type": "object",
    "properties": {
        "name":{
            "type":"string",
            "pattern":"^[A-Za-z0-9_ ]{3,50}$"
        },
        "email":{
            "type":"string",
            "pattern":".+\@.+\..+"
        },
        "password":{
            "type":"string",
            "minLength":5
        }
    },
    "required":["name", "email", "password"]
}


module.exports = ajv.compile(schema);