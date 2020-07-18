// modules
const path = require("path");
const express = require("express");
const chalk = require("chalk");
const methodOverride = require("method-override");
const passport = require("passport");
const expressSession = require("express-session");

//database connection
require("./configs/db");

// routes file
const campRoutes = require("./routes/camps");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/auth");

// express config
const app = express();
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join("public")));
app.use(methodOverride("_method"));
app.use(
	expressSession({
		secret: "People don't like secrets but they keep it with them all the time.",
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());

//passport config
require("./configs/passport");

//middleware
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// routes config
app.get("/", (req, res) => {
	res.render("home", { title: "Home" });
});

app.use(authRoutes);
app.use(campRoutes);
app.use(commentRoutes);

app.get("*", (req, res) => {
	res.render("404", { pageTitle: "404", error: "Page not found." });
});

// server
const port = process.env.PORT || "3000";
app.listen(port, () => {
	console.log(chalk.blue("====================="));
	console.log(chalk.bold(`http://localhost:${chalk.bold.red(port)}`));
	console.log(chalk.blue("====================="));
});
