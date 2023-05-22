const URL = require("../models/urlModel");
const monitorWebsite = require("../utils/monitors/monitorUrl");

let addURL = async (req, res) => {
	try {
		let { link, userID, tag } = req.body;

		let newUrl = await URL.findOne({ link: link }).exec();

		if (newUrl) {
			return res.status(400).json({
				message: "URL already exists",
			});
		}

		newUrl = new URL({
			link: link,
			userID: userID,
			tag: tag || "none",
		});

		await newUrl.save();

		// start monitoring the URL
		if (process.env.NODE_ENV !== "test") monitorWebsite(link);

		return res.status(200).json({
			message: "URL added successfully and monitoring started",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

let getURLByLink = async (req, res) => {
	try {
		let url = req.url;

		return res.status(200).json({
			message: "URL found",
			url: url,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

let getUserURLs = async (req, res) => {
	try {
		let { userID } = req.body;

		let urls = await URL.find({ userID: userID }).exec();

		return res.status(200).json({
			message: "Your URLs",
			urls: urls,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

let updateURL = async (req, res) => {
	try {
		let { link } = req.url;
		let urlExists = await URL.findOne({ link: req.body.link }).exec();
		// check if the new URL exists in another document
		if (urlExists) {
			if (urlExists.link !== link)
				return res.status(400).json({
					message: "Can't update, Link already exists",
				});
		}

		let url = await URL.findOneAndUpdate({ link: link }, req.body);
		return res.status(200).json({
			message: "URL updated successfully",
			url: url,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

let deleteURLByLink = async (req, res) => {
	try {
		let { link } = req.url;

		await URL.findOneAndDelete({ link: link });

		return res.status(200).json({
			message: "URL deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

let getUserURLsByTag = async (req, res) => {
	try {
		let { tag } = req.params;
		let { userID } = req.body;

		let urls = await URL.find({ tag: tag, userID: userID }).exec();

		return res.status(200).json({
			message: "Your URLs",
			urls: urls,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

module.exports = {
	addURL,
	getURLByLink,
	getUserURLs,
	updateURL,
	deleteURLByLink,
	getUserURLsByTag,
};
