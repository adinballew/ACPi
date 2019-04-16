const express = require("express");
const router = express.Router();
const googleCalendar = require("../googleCalendar");

/* GET index */
router.get("/", function (req, res, next) {
    console.log(googleCalendar.todaysEvents);
    res.render("index", {});
});

router.get("/recent-data", function (req, res, next) {
    res.render("recent-data", {});
});

module.exports = router;