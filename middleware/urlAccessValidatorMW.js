const URL = require("../models/urlModel");

module.exports = async (req, res, next) => {
	try {
		let link = req.query.link;
		link = link.slice(1, -1);
		console.log(link);
		const url = await URL.findOne({ link: link });

		if (!url) {
			return res.status(404).json({
				message: "URL not found",
			});
		}

		if (req.body.userID !== url.userID) {
			return res.status(401).json({
				message: "Unauthorized",
			});
		}
		req.url = url;
		next();
	} catch (error) {
		res.status(500).json({ 
			message: "Internal Server Error" 
		});
	}
};
