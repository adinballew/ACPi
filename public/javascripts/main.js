const socket = io(); //load socket.io-client and connect to the host that serves the page
const chartMaxLength = 10;

/** Adds Data to Chart **/
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

/** Shifts Data once Max Length Reached **/
function shiftData(chart, label, data) {
    chart.data.labels.shift();
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
        dataset.data.push(data);
    });
    chart.update();
}

/** Listening for "temp" signal **/
socket.on("temp", function (data) {
    /** Update HTML elements with data **/
    document.getElementById("envTemp").innerHTML = data.temperature;
    document.getElementById("envHum").innerHTML = data.humidity;
    document.getElementById("date").innerHTML = "Date: " + data.date;

    /** Updates Charts **/
    if (chart1.data.labels.length !== chartMaxLength) {
        addData(chart1, data.time, data.temperature);
        addData(chart2, data.time, data.humidity);
        addData(chart3, data.time, data.pressure);
        addData(chart4, data.time, data.lux);
    } else {
        shiftData(chart1, data.time, data.temperature);
        shiftData(chart2, data.time, data.humidity);
        shiftData(chart3, data.time, data.pressure);
        shiftData(chart4, data.time, data.lux);
    }
});

/** Listening for "ac_state" signal **/
socket.on("ac_state", function (data) {
    if (data.desiredTemp !== "Off") localStorage.setItem("acDesiredTemp", data.desiredTemp);

    //Receives the emitted state signal from the controller
    document.getElementById("acSetting").innerHTML = data.setting;
    document.getElementById("acRunning").innerHTML = data.running;
    document.getElementById("acDesiredTemp").innerHTML = data.desiredTemp;
    document.getElementById("acCycleState").innerHTML = data.cycleState;
    document.getElementById("acCountdown").innerHTML = data.countdown;
    document.getElementById("acAuto").innerHTML = data.auto;
    switch (data.setting) {
        case "cool":
            document.getElementById("radio1").checked = true;
            break;
        case "heat":
            document.getElementById("radio2").checked = true;
            break;
        default:
            document.getElementById("radio3").checked = true;
            break;
    }
    if (data.auto !== "off") {
        document.getElementById("toggleAuto").checked = true;
        document.getElementById("desired-temp").innerHTML = "Auto";
    }
    else {
        document.getElementById("desired-temp").innerHTML = data.desiredTemp;
    }
});

/** When page loads **/
window.addEventListener("load", function () {
    const cool = document.getElementById("radio1");
    const heat = document.getElementById("radio2");
    const off = document.getElementById("radio3");
    const slider = document.getElementById("acDesiredTempSlider");
    const output = document.getElementById("desired-temp");
    const toggleAuto = document.getElementById("toggleAuto");

    slider.value = localStorage.getItem("acDesiredTemp"); // Set slider value to cached value
    output.innerHTML = slider.value; // Display the default slider value

    cool.addEventListener("change", function () { //add event listener for when checkbox changes
        socket.emit("cool", slider.value); //send button status to server (as 1 or 0)
    });
    heat.addEventListener("change", function () { //add event listener for when checkbox changes
        socket.emit("heat", slider.value); //send button status to server (as 1 or 0)
    });
    off.addEventListener("change", function () { //add event listener for when checkbox changes
        socket.emit("off", "Off"); //send button status to server (as 1 or 0)
    });

    slider.oninput = function () {
        output.innerHTML = this.value;
    };
    slider.onchange = function () {
        if (cool.checked) {
            socket.emit("cool", this.value);
        }
        if (heat.checked) {
            socket.emit("heat", this.value);
        }
    };

    toggleAuto.onchange = function () {
        if (toggleAuto.checked) {
            socket.emit("auto", "on");
        } else {
            socket.emit("auto", "off");
        }
    }
});