const router = require("express").Router();

const camps = [
	{ name: "Lake Paradise", imageUrl: "http://lake.com" },
	{ name: "Lake Paradise", imageUrl: "http://lake.com" },
	{ name: "Lake Paradise", imageUrl: "http://lake.com" },
];

router.get("/camps", (req, res) => {
	res.render("camps", { pageTitle: "Camps", camps });
});

router.post("/camps", (req, res) => {
	res.send("/camps post");
});

router.get("/camps/new", (req, res) => {
	res.send("/camps/new");
});

module.exports = router;
