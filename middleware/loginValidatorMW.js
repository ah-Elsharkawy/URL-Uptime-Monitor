const validator = require("../utils/loginValidator");


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