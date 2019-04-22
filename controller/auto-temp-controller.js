const schedule = require("node-schedule");
const googleCalendar = require("../googleCalendar");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const io = require("../io");

let todaysEvents = {};
let desiredTemp = undefined;

function getTodaysEvents(data) {
    if (data === "on") {
        googleCalendar.refreshEvents();
        if (todaysEvents !== googleCalendar.todaysEvents) {
            todaysEvents = googleCalendar.todaysEvents;
        }
        autoInEventRange();
    }
}

/**Checks to see if Object is Empty**/
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

function inRange(event) {
    let currentTime = moment(new Date());
    // Google Calendar is giving an incorrect time but it can be used.
    let wrongStartTime = moment(new Date(event.start));
    let wrongEndTime = moment(new Date(event.end));

    // Correcting StartTime
    let correctStartTime = new Date();
    correctStartTime.setHours(wrongStartTime.hours(), wrongStartTime.minutes(),
        wrongStartTime.seconds(), wrongStartTime.milliseconds());
    // Correcting EndTime
    let correctEndTime = new Date();
    correctEndTime.setHours(wrongEndTime.hours(), wrongEndTime.minutes(),
        wrongEndTime.seconds(), wrongEndTime.milliseconds());

    return currentTime.isAfter(correctStartTime) && currentTime.isBefore(correctEndTime);
}

function autoInEventRange() {
    if (!isEmptyObject(todaysEvents)) {
        Object.keys(todaysEvents).forEach(event => {
            if (inRange(todaysEvents[event])) {
                desiredTemp = todaysEvents[event].description;
                console.log(desiredTemp);
            }
        });
    }
}

//
// function scheduleJobs() {
//     // Every Day at midnight get the current days events
//     schedule.scheduleJob("0 0 * * *", () => {
//         googleCalendar();
//     });
//     // Every Minute
//     schedule.scheduleJob("* * * * *", () => {
//         todaysEvents = googleCalendar.todaysEvents;
//     });
// }
//
// module.exports.scheduleJobs = () => scheduleJobs();
module.exports.getTodaysEvents = (data) => getTodaysEvents(data);
module.exports.todaysEvents = todaysEvents;
module.exports.desiredTemp = desiredTemp;