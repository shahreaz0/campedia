const router = require("express").Router();

const Camp = require("../models/Camp");
const Comment = require("../models/Comment");

// GET /camps/:id ---> shows all comments --> this routes already exists

// GET /camps/:id ---> shows form --> this route already exists

// POST /camps/:id/comments --> redirect to /camps/:id
router.post("/camps/:id/comments", async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);
		const comment = new Comment({
			content: req.body.content,
			author: req.body.author,
		});

		await comment.save();
		camp.comments.push(comment);
		await camp.save();
		res.redirect("/camps/" + req.params.id);
	} catch (error) {
		res.redirect(`/camps/${req.params.id}`);
		console.log(error);
	}
});

// PUT /camps/:id/comments/:id --> edit form

// DELETE /camps/:id/comments/:id --> delete comment

module.exports = router;
