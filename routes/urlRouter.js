const express = require("express");
const router = express.Router();
const validateURLData = require("../middleware/urlValidatorMW");
const validateToken = require("../middleware/tokenValidatorMW");
const validateAuth = require("../middleware/urlAccessValidatorMW");
const {
	addURL,
	getURLByLink,
	getUserURLs,
	updateURL,
	deleteURLByLink,
	getUserURLsByTag
} = require("../controllers/urlController");

router.post("/", validateToken, validateURLData, addURL);

router.get("/metrics", validateToken, validateAuth, getURLByLink);

router.get("/all", validateToken, getUserURLs);

router.get("/tag/:tag", validateToken, getUserURLsByTag)

router.put("/", validateToken, validateURLData, validateAuth, updateURL);

router.delete("/", validateToken, validateAuth, deleteURLByLink);

module.exports = router;
