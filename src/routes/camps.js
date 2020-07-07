const router = require("express").Router();
const path = require("path");
const fs = require("fs");
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
		res.render("camps/index", { pageTitle: "Camps", camps });
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
		res.redirect("/camps");
	} catch (error) {
		console.log(error);
	}
});

router.get("/camps/new", (req, res) => {
	res.render("camps/new", { pageTitle: "Add Camp" });
});

router.get("/camps/:id", async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);
		res.render("camps/show", { pageTitle: camp.name, camp });
	} catch (error) {
		console.log(error);
	}
});

router.get("/camps/:id/edit", async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);
		res.render("camps/edit", { pageTitle: "Edit camp", camp });
	} catch (error) {
		console.log(error);
	}
});

router.put("/camps/:id", upload.single("campImg"), async (req, res) => {
	try {
		// find camp by id
		const camp = await Camp.findById(req.params.id);

		// delete the old image
		fs.unlink(
			path.join("public", "img", "campImg", camp.imageName),
			(error) => {
				if (error) throw error;
			},
		);

		// edit
		camp.name = req.body.name;
		camp.description = req.body.description;
		camp.imageName = req.file.filename;

		//save
		await camp.save();

		//redirect
		res.redirect(`/camps/${req.params.id}`);
	} catch (error) {
		console.log(error);
	}
});

router.delete("/camps/:id", async (req, res) => {
	const camp = await Camp.findById(req.params.id);

	// delete the old image
	fs.unlink(
		path.join("public", "img", "campImg", camp.imageName),
		(error) => {
			if (error) throw error;
		},
	);

	//remove
	await camp.remove();

	//redirect
	res.redirect("/camps");
});

module.exports = router;