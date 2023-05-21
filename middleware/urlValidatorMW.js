const validator = require("../utils/validators/urlValidator");

module.exports = (req, res, next) => {
    
    let valid = validator(req.body);
	if (!valid) {
		return res.status(400).json({
			message: "Invalid URL",
		});
	}
	next();
};
