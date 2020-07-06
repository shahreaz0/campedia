const mongoose = require("mongoose");
const path = require("path");

const campSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		imageName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

campSchema.virtual("imageUrl").get(function () {
	if (this.imageName) {
		return "\\" + path.join("img", "campImg", this.imageName);
	}
});

module.exports = mongoose.model("Camp", campSchema);
