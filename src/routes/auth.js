const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");

// get /register shows register form
router.get("/register", (req, res) => {
	res.render("auth/register", { pageTitle: "Register" });
});
// post /register
router.post("/register", async (req, res) => {
	try {
		const existedUser = await User.find({ username: req.body.username });
		if (existedUser.length === 1) throw new Error("username already used.");

		const user = new User({ username: req.body.username });
		await user.setPassword(req.body.password);
		await user.save();
		passport.authenticate("local")(req, res, () => {
			res.redirect("/camps");
		});
	} catch (error) {
		console.log(error);
		res.redirect("/register");
	}
});
// get /login shows login form
router.get("/login", (req, res) => {
	res.render("auth/login", { pageTitle: "Login" });
});
// post /login
router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/camps",
		failureRedirect: "/login",
	}),
	(req, res) => {},
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/camps");
});

module.exports = router;
