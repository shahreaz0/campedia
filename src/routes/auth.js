const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");

// passport-local
router.get("/register", (req, res) => {
	res.render("auth/register", { pageTitle: "Register" });
});

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

router.get("/login", (req, res) => {
	res.render("auth/login", { pageTitle: "Login" });
});

router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/camps",
		failureRedirect: "/login",
	}),
	(req, res) => {},
);

//passport-google-oauth20
router.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile"],
	}),
);

router.get("/auth/google/cb", passport.authenticate("google"), (req, res) => {
	res.redirect("/camps");
});

//logout
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/camps");
});

module.exports = router;
