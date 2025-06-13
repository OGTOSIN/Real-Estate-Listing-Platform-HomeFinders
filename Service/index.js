const Auth = require("../Models/authModel");
const Property = require("../Models/propertyModel");
const SavedProperty = require("../Models/savedPropertiesModel");


const findUsers = async (req, res) => {
    const allUsers = await Auth.find();
    res.status(200).json(allUsers);
}

const findProperties = async (req, res) => {
    const allProperties = await Property.find();
    res.status(200).json(allProperties);
}

const findSavedProperties = async (req, res) => {
    const { userId } = req.params;
    try {
        const savedProperties = await SavedProperty.find({ user: userId }).populate('property');
        res.status(200).json(savedProperties);
    } catch (error) {
        res.status(500).json({ message: "Error fetching saved properties", error });
    }
}

module.exports = {
    findUsers,
    findProperties,
    findSavedProperties
}