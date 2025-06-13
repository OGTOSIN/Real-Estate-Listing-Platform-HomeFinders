const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../Models/authModel");
const Property = require("../Models/propertyModel");
const SavedProperty = require("../Models/savedPropertiesModel");
const {
  findUsers,
  findProperties,
  findSavedProperties,
} = require("../Service/");

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phoneNumber,
      isAgent,
    } = req.body;

    if (
      !firstName ||
      typeof firstName !== "string" ||
      firstName.length < 2 ||
      firstName.length > 50
    ) {
      return res.status(400).json({
        error:
          "Invalid firstName. Must be a string between 2 and 50 characters.",
      });
    }
    if (
      !lastName ||
      typeof lastName !== "string" ||
      lastName.length < 2 ||
      lastName.length > 50
    ) {
      return res.status(400).json({
        error:
          "Invalid lastName. Must be a string between 2 and 50 characters.",
      });
    }
    if (
      !username ||
      typeof username !== "string" ||
      !/^[a-zA-Z0-9]+$/.test(username) ||
      username.length < 3 ||
      username.length > 30
    ) {
      return res.status(400).json({
        error:
          "Invalid username. Must be alphanumeric and between 3 and 30 characters.",
      });
    }
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    if (
      !password ||
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 128
    ) {
      return res.status(400).json({
        error: "Invalid password. Must be between 6 and 128 characters.",
      });
    }
    if (
      !phoneNumber ||
      typeof phoneNumber !== "string" ||
      !/^\+?\d{10,15}$/.test(phoneNumber)
    ) {
      return res.status(400).json({
        error:
          "Invalid phoneNumber. Must be a valid phone number with 10 to 15 digits.",
      });
    }

    // Check if email or username already exists
    const existingUser = await Auth.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email or username already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = Auth({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      isAgent,
    });

    await newUser.save();

    res.status(201).json({
      message: "User successfully created",
      newUser: {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Require either email or username
    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ error: "Email or username and password are required." });
    }

    // Validate email if provided
    if (email) {
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return res.status(400).json({ error: "Invalid email format." });
      }
    }

    // Validate username if provided
    if (username) {
      if (typeof username !== "string" || !/^[a-zA-Z0-9]+$/.test(username)) {
        return res.status(400).json({ error: "Invalid username format." });
      }
    }

    // Validate password
    if (
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 128
    ) {
      return res
        .status(400)
        .json({ error: "Password must be between 6 and 128 characters." });
    }

    // Find user by email or username
    const user = await Auth.findOne(email ? { email } : { username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        username: user?.username,
      },
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Auth.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const findUsers = async (req, res) => {
//   try {
//     const user = await Auth.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, propertyType, image } =
      req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (typeof title !== "string") {
      return res.status(400).json({ error: "Title must be a string." });
    }
    if (title.length < 3) {
      return res
        .status(400)
        .json({ error: "Title must be at least 3 characters long." });
    }
    if (title.length > 100) {
      return res
        .status(400)
        .json({ error: "Title must not exceed 100 characters." });
    }

    // Validate description
    if (!description) {
      return res.status(400).json({ error: "Description is required." });
    }
    if (typeof description !== "string") {
      return res.status(400).json({ error: "Description must be a string." });
    }
    if (description.length < 10) {
      return res
        .status(400)
        .json({ error: "Description must be at least 10 characters long." });
    }

    // Validate price
    if (price === undefined || price === null) {
      return res.status(400).json({ error: "Price is required." });
    }
    if (typeof price !== "number") {
      return res.status(400).json({ error: "Price must be a number." });
    }
    if (price <= 0) {
      return res
        .status(400)
        .json({ error: "Price must be a positive number." });
    }

    // Validate location
    if (!location) {
      return res.status(400).json({ error: "Location is required." });
    }
    if (typeof location !== "string") {
      return res.status(400).json({ error: "Location must be a string." });
    }
    if (location.length < 2) {
      return res
        .status(400)
        .json({ error: "Location must be at least 2 characters long." });
    }

    // Validate propertyType
    if (!propertyType) {
      return res.status(400).json({ error: "Property type is required." });
    }
    if (typeof propertyType !== "string") {
      return res.status(400).json({ error: "Property type must be a string." });
    }

    // Optional: Validate image (if provided)
    if (image && typeof image !== "string") {
      return res
        .status(400)
        .json({ error: "Image must be a string (URL or path) if provided." });
    }
    // Check if a property with the same title and location already exists for this agent
    const existingProperty = await Property.findOne({
      title: title.trim(),
      location: location.trim(),
      agentId: req.user.id,
    });

    if (existingProperty) {
      return res.status(409).json({
        error:
          "A property with the same title and location already exists for this agent. Please use a different title or location.",
        existingProperty: {
          id: existingProperty._id,
          title: existingProperty.title,
          location: existingProperty.location,
          price: existingProperty.price,
          description: existingProperty.description,
          agentId: existingProperty.agentId,
        },
      });
    }
    // Get userId from token
    const userId = req.user.id;

    // Check if the user exists and is an agent
    // 2. Enforce permissions: only agents can create.
    const agent = await Auth.findById(userId);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }
    if (!agent.isAgent) {
      return res.status(403).json({ error: "User is not an agent." });
    }

    const newProperty = new Property({
      title,
      description,
      price,
      location,
      propertyType,
      image,
      agentId: userId, // tie property to agent
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findProperty = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { notes, isFavorite } = req.body;

    // Validate notes
    if (notes && typeof notes !== "string") {
      return res.status(400).json({ error: "Notes must be a string." });
    }
    if (notes && notes.length > 500) {
      return res
        .status(400)
        .json({ error: "Notes must not exceed 500 characters." });
    }

    // Validate isFavorite
    if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
      return res.status(400).json({ error: "isFavorite must be a boolean." });
    }

    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }

    // Check if the user already saved this property
    const existingSavedProperty = await SavedProperty.findOne({
      user: req.user.id,
      property: propertyId,
    });

    if (existingSavedProperty) {
      return res.status(409).json({
        error: "This property is already saved.",
        existingSavedProperty,
      });
    }

    // Create a new saved property
    const savedProperty = new SavedProperty({
      user: req.user.id,
      property: propertyId,
      notes,
      isFavorite,
    });

    await savedProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const savedProperties = async (req, res) => {
  try {
    const savedProperties = await SavedProperty.find({ user: req.user.id })
      .populate("property")
      .exec();
    res.status(200).json(savedProperties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const savedPropertiesById = async (req, res) => {
  try {
    const savedProperty = await SavedProperty.findById(req.params.id)
      .populate("property")
      .exec();
    if (!savedProperty) {
      return res.status(404).json({ error: "Saved property not found" });
    }
    res.status(200).json(savedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeSavedProperty = async (req, res) => {
  try {
    const savedProperty = await SavedProperty.findByIdAndDelete(req.params.id);
    if (!savedProperty) {
      return res.status(404).json({ error: "Saved property not found" });
    }
    res.status(200).json({ message: "Saved property removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSavedProperty = async (req, res) => {
  try {
    const { notes, isFavorite } = req.body;

    // Validate notes
    if (notes && typeof notes !== "string") {
      return res.status(400).json({ error: "Notes must be a string." });
    }
    if (notes && notes.length > 500) {
      return res
        .status(400)
        .json({ error: "Notes must not exceed 500 characters." });
    }

    // Validate isFavorite
    if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
      return res.status(400).json({ error: "isFavorite must be a boolean." });
    }

    const savedProperty = await SavedProperty.findByIdAndUpdate(
      req.params.id,
      { notes, isFavorite },
      { new: true }
    ).populate("property");

    if (!savedProperty) {
      return res.status(404).json({ error: "Saved property not found" });
    }

    res.status(200).json(savedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const propertyFilter = async (req, res) => {
  try {
    const { priceRange, propertyType, location } = req.query;

    const filters = {};
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split(",").map(Number);
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (propertyType) {
      filters.propertyType = propertyType;
    }
    if (location) {
      filters.location = new RegExp(location, "i"); // Case-insensitive search
    }

    const properties = await Property.find(filters);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  registerUser,
  userLogin,
  getAllUsers,
  findUsers,
  createProperty,
  findProperty,
  findPropertyById,
  saveProperty,
  savedProperties,
  savedPropertiesById,
  removeSavedProperty,
  updateSavedProperty,
  propertyFilter,
};
