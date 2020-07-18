const router = require("express").Router();

// get /register shows register form
router.get("/register", (req, res) => {
	res.send("show register form");
});
// post /register
router.post("/register", (req, res) => {
	res.send("/register");
});
// get /login shows login form
router.get("/login", (req, res) => {
	res.send("get login form");
});
// post /login
router.post("/login", (req, res) => {
	res.send("post /login");
});

module.exports = router;
