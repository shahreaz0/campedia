const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Camp = require("../models/Camp");
const { userInfo } = require("os");

//middleware
const { isLoggedIn, isCampOwner } = require("../configs/middleware");

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
		const camps = await Camp.find({}).populate("creator").exec();
		res.render("camps/index", { pageTitle: "Camps", camps });
	} catch (error) {
		res.redirect("/");
		console.log(error);
	}
});

router.post("/camps", upload.single("campImg"), isLoggedIn, async (req, res) => {
	try {
		const camp = new Camp({
			name: req.body.campName,
			imageName: req.file.filename,
			description: req.body.description,
			creator: req.user._id,
		});
		await camp.save();
		res.redirect("/camps");
	} catch (error) {
		res.redirect("/camps");
		console.log(error);
	}
});

router.get("/camps/new", isLoggedIn, (req, res) => {
	res.render("camps/new", { pageTitle: "Add Camp" });
});

// show single camp + shows all comments + show comment form
router.get("/camps/:id", async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id).populate("comments").exec();
		res.render("camps/show", { pageTitle: camp.name, camp });
	} catch (error) {
		res.redirect("camps");
		console.log(error);
	}
});

router.get("/camps/:id/edit", isCampOwner, async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);
		res.render("camps/edit", { pageTitle: "Edit camp", camp });
	} catch (error) {
		res.redirect(`/camps/${req.params.id}`);
		console.log(error);
	}
});

router.put("/camps/:id", isCampOwner, upload.single("campImg"), async (req, res) => {
	try {
		// find camp by id
		const camp = await Camp.findById(req.params.id);

		// delete the old image

		if (req.file) {
			fs.unlink(path.join("public", "img", "campImg", camp.imageName), (error) => {
				if (error) throw error;
			});
			camp.imageName = req.file.filename;
		}

		// edit
		if (req.body.name) camp.name = req.body.name;
		if (req.body.description) camp.description = req.body.description;

		//save
		await camp.save();

		//redirect
		res.redirect(`/camps/${req.params.id}`);
	} catch (error) {
		res.redirect(`/camps/${req.params.id}`);
		console.log(error);
	}
});

router.delete("/camps/:id", isCampOwner, async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);

		// delete the old image
		fs.unlink(path.join("public", "img", "campImg", camp.imageName), (error) => {
			if (error) throw error;
		});

		//remove
		await camp.remove();

		//redirect
		res.redirect("/camps");
	} catch (error) {
		res.redirect("/camps");
		console.log(error);
	}
});

module.exports = router;
