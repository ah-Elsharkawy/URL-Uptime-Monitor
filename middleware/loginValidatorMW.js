const validator = require("../utils/validators/loginValidator");


// Authentication(login) validator
module.exports = (req, res, next) => {

    let valid = validator(req.body);
    
    if(valid){
        next();
    }
    else{
        res.status(403).json({
            message: "Invalid login credentials"
        })
    }
}