const express = require("express");
const {
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} = require("../controllers/slideshowController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateObjectId = require("../middleware/validateObjectId");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getSlides);
router.post("/", protect, authorize("admin"), upload.array("images", 20), createSlide);
router.put("/:id", protect, authorize("admin"), validateObjectId(), upload.single("image"), updateSlide);
router.delete("/:id", protect, authorize("admin"), validateObjectId(), deleteSlide);

module.exports = router;
