const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	content: {
		type: String,
		trim: true,
	},
	author: {
		type: String,
	},
});

module.exports = mongoose.model("Comment", commentSchema);
