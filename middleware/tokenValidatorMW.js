const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const token = req.header("x-auth-token");

	if (!token) return res.status(401).json({ message: "Access denied, please login" });

	try {
		const decodePayload = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userID = decodePayload.userID;
		next();
	} catch (err) {
		console.log(err);
		res.status(400).json({message: "Invalid token"});
	}
};
