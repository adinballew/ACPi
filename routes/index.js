const express = require("express");
const router = express.Router();

/* GET index */
router.get("/", function (req, res, next) {
    res.render("index", {});
});

router.get("/recent-data", function (req, res, next) {
    res.render("recent-data", {});
});

module.exports = router;