const socket = io(); //load socket.io-client and connect to the host that serves the page

const ctx1 = document.getElementById("chart1").getContext("2d");
const chart1 = new Chart(ctx1, {
    // The type of chart we want to create
    type: "line",
    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Temperature",
            borderColor: "#26ff4e",
            data: [],
            fill: false,
            pointStyle: "circle",
            backgroundColor: "#14db74",
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        title: {
            display: true,
            text: ""
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Temperature"
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Value"
                },
                ticks: {
                    beginAtZero: true,
                    max: 90,
                    min: 50
                }
            }]
        }
    }
});

const ctx2 = document.getElementById("chart2").getContext("2d");
const chart2 = new Chart(ctx2, {
    // The type of chart we want to create
    type: "line",
    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Humidity",
            borderColor: "#4152ff",
            data: [],
            fill: false,
            pointStyle: "circle",
            backgroundColor: "#8330ff",
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        title: {
            display: true,
            text: ""
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Humidity"
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Value"
                },
                ticks: {
                    beginAtZero: true,
                    max: 50,
                    min: 10
                }
            }]
        }
    }
});

const ctx3 = document.getElementById("chart3").getContext("2d");
const chart3 = new Chart(ctx3, {
    // The type of chart we want to create
    type: "line",
    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Pressure",
            borderColor: "#ff3d43",
            data: [],
            fill: false,
            pointStyle: "circle",
            backgroundColor: "#a930ff",
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        title: {
            display: true,
            text: ""
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Pressure"
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Value"
                },
                ticks: {
                    beginAtZero: true,
                    max: 2000,
                    min: 500
                }
            }]
        }
    }
});

const ctx4 = document.getElementById("chart4").getContext("2d");
const chart4 = new Chart(ctx4, {
    // The type of chart we want to create
    type: "line",
    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Lux",
            borderColor: "#ffdf1a",
            data: [],
            fill: false,
            pointStyle: "circle",
            backgroundColor: "#ff7900",
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        title: {
            display: true,
            text: ""
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Lux"
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Value"
                },
                ticks: {
                    beginAtZero: true,
                    max: 2000,
                    min: 0
                }
            }]
        }
    }
});

/* Listening for "temp" signal */
socket.on("temp", function (data) {
    /* Update HTML elements with data */
    document.getElementById("envTemp").innerHTML = data.temperature;
    document.getElementById("envHum").innerHTML = data.humidity;
    document.getElementById("date").innerHTML = "Date: " + data.date;

    /* Chart1 */
    if (chart1.data.labels.length !== 10) {                  //If we have less than 15 data points in the graph
        chart1.data.labels.push(data.time);                  //Add time in x-asix
        chart1.data.datasets[0].data.push(data.temperature);
    } else {                                                //If there are already 30 data points in the graph.
        chart1.data.labels.shift();                          //Remove oldest time data
        chart1.data.labels.push(data.time);                  //Insert latest time data
        chart1.data.datasets[0].data.shift();                //Remove oldest temp data
        chart1.data.datasets[0].data.push(data.temperature); //Insert latest temp data
    }
    /* Chart2 */
    if (chart2.data.labels.length !== 10) {                  //If we have less than 15 data points in the graph
        chart2.data.labels.push(data.time);                  //Add time in x-asix
        chart2.data.datasets[0].data.push(data.humidity);
    } else {                                                //If there are already 30 data points in the graph.
        chart2.data.labels.shift();                          //Remove oldest time data
        chart2.data.labels.push(data.time);                  //Insert latest time data
        chart2.data.datasets[0].data.shift();                //Remove oldest hum data
        chart2.data.datasets[0].data.push(data.humidity);    //Insert latest hum data
    }
    /* Chart3 */
    if (chart3.data.labels.length !== 10) {                  //If we have less than 15 data points in the graph
        chart3.data.labels.push(data.time);                  //Add time in x-asix
        chart3.data.datasets[0].data.push(data.pressure);
    } else {                                                //If there are already 30 data points in the graph.
        chart3.data.labels.shift();                          //Remove oldest time data
        chart3.data.labels.push(data.time);                  //Insert latest time data
        chart3.data.datasets[0].data.shift();                //Remove oldest hum data
        chart3.data.datasets[0].data.push(data.pressure);    //Insert latest hum data
    }
    /* Chart4 */
    if (chart4.data.labels.length !== 10) {                  //If we have less than 15 data points in the graph
        chart4.data.labels.push(data.time);                  //Add time in x-asix
        chart4.data.datasets[0].data.push(data.lux);
    } else {                                                //If there are already 30 data points in the graph.
        chart4.data.labels.shift();                          //Remove oldest time data
        chart4.data.labels.push(data.time);                  //Insert latest time data
        chart4.data.datasets[0].data.shift();                //Remove oldest hum data
        chart4.data.datasets[0].data.push(data.lux);    //Insert latest hum data
    }
    chart1.update(); //Update Graph on signal
    chart2.update();
    chart3.update();
    chart4.update();
});

/* Listening for "ac_state" signal */
socket.on("ac_state", function (data) {
    //Receives the emitted state signal from the controller
    document.getElementById("acSetting").innerHTML = data.setting;
    document.getElementById("acDesiredTemp").innerHTML = data.desiredTemp;
    document.getElementById("acRunning").innerHTML = data.running;
    document.getElementById("acCountdown").innerHTML = data.countdown;
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
});

/* When page loads */
window.addEventListener("load", function () {
    const cool = document.getElementById("radio1");
    const heat = document.getElementById("radio2");
    const off = document.getElementById("radio3");
    const slider = document.getElementById("myRange");
    const output = document.getElementById("desired-temp");

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
});