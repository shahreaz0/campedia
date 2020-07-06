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

// routes
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
			imageName: req.file.filename,
			description: req.body.description,
		});

		await camp.save();
		console.log(camp.imageUrl);
		res.redirect("/camps");
	} catch (error) {
		console.log(error);
	}
});

router.get("/camps/new", (req, res) => {
	res.render("new", { pageTitle: "Add Camp" });
});

router.get("/camps/:id", async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);
		res.render("show", { pageTitle: camp.name, camp });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
