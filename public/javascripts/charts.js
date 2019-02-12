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
                    max: 60,
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
                    max: 500,
                    min: 0
                }
            }]
        }
    }
});