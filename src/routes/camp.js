const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const Camp = require("../models/Camp");

// multer config
const upload = multer({
	dest: path.join("public", "img", "campImg"),
	limits: 100000,
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
			cb(new Error("File type not allowed."));
		}
		cb(null, true);
	},
});

router.get("/camps", async (req, res) => {
	try {
		const camps = await Camp.find({});
		res.render("camps", { pageTitle: "Camps", camps });
	} catch (error) {
		console.log(error);
	}
});

router.post("/camps", upload.single("campImg"), async (req, res) => {
	try {
		const camp = new Camp({
			name: req.body.campName,
			imageUrl: "\\" + path.join("img", "campImg", req.file.filename),
		});

		await camp.save();
		console.log(camp);
		res.redirect("/camps");
	} catch (error) {
		console.log(error);
	}
});

router.get("/camps/new", (req, res) => {
	res.render("new", { pageTitle: "Add Camp" });
});

module.exports = router;
