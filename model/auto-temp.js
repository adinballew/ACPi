const googleCalendar = require("../googleCalendar");
const Moment = require("moment/moment");
const MomentRange = require("moment-range/dist/moment-range");
const moment = MomentRange.extendMoment(Moment);

let todaysEvents = {};

/** If data is on get events todays events from calendar
 * @param data
 * @returns {Promise<any>}
 */
function getTodaysEvents(data) {
    return new Promise((resolve, reject) => {
        if (data === "on") {
            googleCalendar.refreshEvents();
            if (todaysEvents !== googleCalendar.todaysEvents) {
                todaysEvents = googleCalendar.todaysEvents;
            }
            autoInEventRange(callback => {
                if (typeof callback === "undefined")
                    reject();
                else
                    resolve(callback);
            });
        }
    });
}

/**Checks to see if Object is Empty
 * @param obj Object**/
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

/** Checks to see if current datetime is in a scheduled event range.
 * @param event
 * @returns {boolean}
 */
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

function autoInEventRange(callback) {
    if (!isEmptyObject(todaysEvents)) {
        Object.keys(todaysEvents).forEach(event => {
            if (inRange(todaysEvents[event]))
                callback(todaysEvents[event].description);
            else
                console.log("No events scheduled"); //TODO: No events is triggering when there are events.
        });
    }
}

module.exports.getTodaysEvents = (data) => getTodaysEvents(data);