const express = require('express');
const { handleCreateProperty, handleFindProperties, handleFindProperty, handleSaveProperty, handleGetSavedProperties, handleGetSavedProperty, handleRemoveSavedProperty, handleUpdateSavedProperty, handlePropertyFilter } = require("../Controllers");
const { auth, agentAuth, adminAuth } = require("../Middleware");
const router = express.Router();



// Property routes
router.post("/create-property", agentAuth, handleCreateProperty);
router.get("/properties", auth, handleFindProperties);
router.get("/property/:id", auth, handleFindProperty);
router.post ("/save-property/:propertyId", auth, handleSaveProperty);
router.get("/saved-properties", auth, handleGetSavedProperties);
router.get("/saved-property/:savedPropertyId", auth, handleGetSavedProperty);
router.delete("/remove-saved-property/:savedPropertyId", auth, handleRemoveSavedProperty);
router.put("/update-saved-property/:savedPropertyId", auth, handleUpdateSavedProperty);
router.get("/properties/filter", auth, handlePropertyFilter);

module.exports = router;
