const validator = require("../utils/validators/signupValidator");

// (signup) validator
module.exports = (req, res, next) => {
	let valid = validator(req.body);

	if (valid) {
		next();
	} else {
		res.status(403).json({
			message: "Invalid signup format",
		});
	}
};
