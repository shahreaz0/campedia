const mongoose = require("mongoose");

const campSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Camp", campSchema);
