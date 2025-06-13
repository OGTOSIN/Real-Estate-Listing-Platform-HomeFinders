const mongoose = require("mongoose");

const savedPropertiesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    notes: { type: String, maxlength: 500 }, // Optional: user notes about the property
    savedAt: { type: Date, default: Date.now },
    isFavorite: { type: Boolean, default: false }, // Optional: mark as favorite
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const SavedProperty = mongoose.model("SavedProperty", savedPropertiesSchema);

module.exports = SavedProperty;

