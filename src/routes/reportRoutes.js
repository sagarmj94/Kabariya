const express = require("express");
const router = express.Router();
const Report = require("../models/report.model");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, area } = req.body;
    const image = req.file.filename;
    const report = new Report({
      user: req.user.userId,
      title,
      description,
      area,
      image,
    });
    await report.save();
    res.status(201).json({ message: "Report created" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  const reports = await Report.find()
    .populate("user", "email")
    .sort({ createdAt: -1 });
  res.json(reports);
});

module.exports = router;
