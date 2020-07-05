const router = require("express").Router();
const path = require("path");
const multer = require("multer");

const camps = [];

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

router.get("/camps", (req, res) => {
	res.render("camps", { pageTitle: "Camps", camps });
});

router.post("/camps", upload.single("campImg"), (req, res) => {
	camps.push({
		name: req.body.campName,
		imageUrl: "/" + path.join("img", "campImg", req.file.filename),
	});
	console.log(camps);
	res.redirect("/");
});

router.get("/camps/new", (req, res) => {
	res.render("new", { pageTitle: "Add Camp" });
});

module.exports = router;
