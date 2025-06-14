const express = require('express');
const { handleWelcomeMessage, handleRegisterUser, handleUserLogin, handleGetAllUsers, handleFindUser } = require("../Controllers");
const { validateDetails, auth, adminAuth } = require("../Middleware");
const router = express.Router();


// Welcome message route
router.get ("/", handleWelcomeMessage);

// User routes
router.post ("/register", validateDetails, handleRegisterUser);
router.post("/login", validateDetails, handleUserLogin);
router.get ("/users", adminAuth, handleGetAllUsers);
router.get("/user/:id", adminAuth, handleFindUser);


module.exports = router;
