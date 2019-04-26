const autoTemp = require("./auto-temp");
const acController = require("../controller/ac-controller");

/**Changes the state of the ac controller current *
 * @param name The setting of ac unit
 * @param data The data that is passed when a signal is sent
 */
module.exports = function (name, data) {
    switch (name) {
        case "heat":
            console.log(name + ": on");
            acController.changeState("setting", name);
            acController.changeState("desiredTemp", data);
            break;
        case "cool":
            console.log(name + ": on");
            acController.changeState("setting", name);
            acController.changeState("desiredTemp", data);
            break;
        case "off":
            console.log(name + ": on");
            acController.changeState("setting", name);
            acController.changeState("desiredTemp", data);
            acController.changeState("running", false);
            acController.changeState("cycleState", "off");
            acController.changeState("countdown", "EXPIRED");
            break;
        case "auto":
            console.log(name + ": " + data);
            acController.changeState("auto", data);
            autoTemp.getTodaysEvents(data)
                .then((temp) => {
                    acController.changeState("desiredTemp", temp);
                })
                .catch(error => {
                    console.log(error);
                });
            break;
    }
};