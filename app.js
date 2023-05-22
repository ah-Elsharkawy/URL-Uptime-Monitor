require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const urlRouter = require("./routes/urlRouter");
const monitorAllUrls = require("./utils/monitors/monitorAllUrls");
const app = express();
const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("connected to the database ...");
	})
	.catch((e) => {
		console.log(e);
	});

app.use(
	cors({
		exposedHeaders: "x-auth-token",
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/url", urlRouter);

// start the server only if the environment is not test
if (process.env.NODE_ENV !== "test") {
	app.listen(PORT, () => console.log(`listening to port ${PORT}`));

	// start monitoring all the URLs in the database in case of the server gows down all the monitoring stops
	monitorAllUrls();
}

module.exports = app;
