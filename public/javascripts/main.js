const socket = io(); //load socket.io-client and connect to the host that serves the page

const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Temperature",
            borderColor: "#26ff4e",
            data: [],
            fill: false,
            pointStyle: 'circle',
            backgroundColor: '#14db74',
            pointRadius: 5,
            pointHoverRadius: 7,
            // lineTension: 0
        }, {
            label: "Humidity",
            borderColor: "#4152ff",
            data: [],
            fill: false,
            pointStyle: 'circle',
            backgroundColor: '#8330ff',
            pointRadius: 5,
            pointHoverRadius: 7,
            // lineTension: 0
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        title: {
            display: true,
            text: ''
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Sensor Measurements'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    beginAtZero: true,
                    max: 90,
                    min: 40
                }
            }]
        }
    }

});

socket.on('temp', function (data) {
    document.getElementById('envTemp').innerHTML = data.temperature;
    document.getElementById('envHum').innerHTML = data.humidity;
    chart.options.title.text = 'Date: ' + data.date;

    if (chart.data.labels.length !== 30) { //If we have less than 15 data points in the graph
        chart.data.labels.push(data.time);  //Add time in x-asix
        chart.data.datasets[0].data.push(data.temperature);
        chart.data.datasets[1].data.push(data.humidity);
    } else { //If there are already 30 data points in the graph.
        chart.data.labels.shift(); //Remove first time data
        chart.data.labels.push(data.time); //Insert latest time data
        chart.data.datasets[0].data.shift(); //Remove first temp data
        chart.data.datasets[0].data.push(data.temperature); //Insert latest temp data
        chart.data.datasets[1].data.shift(); //Remove first hum data
        chart.data.datasets[1].data.push(data.humidity); //Insert latest hum data
    }
    chart.update(); //Update Graph
});

socket.on('ac_state', function (data) {
    document.getElementById('acSetting').innerHTML = data.setting;
    document.getElementById('acDesiredTemp').innerHTML = data.desiredTemp;
    document.getElementById('acRunning').innerHTML = data.running;
    document.getElementById('acCountdown').innerHTML = data.countdown;
    document.getElementById('acOkToSwitch').innerHTML = data.okToSwitch;
});

window.addEventListener('load', function () { //when page loads
    const cool = document.getElementById('radio1');
    const heat = document.getElementById('radio2');
    const off = document.getElementById('radio3');
    const slider = document.getElementById('myRange');
    const output = document.getElementById('desired-temp');
    output.innerHTML = slider.value; // Display the default slider value

    cool.addEventListener('change', function () { //add event listener for when checkbox changes
        socket.emit('cool', slider.value); //send button status to server (as 1 or 0)
    });
    heat.addEventListener('change', function () { //add event listener for when checkbox changes
        socket.emit('heat', slider.value); //send button status to server (as 1 or 0)
    });
    off.addEventListener('change', function () { //add event listener for when checkbox changes
        socket.emit('off', 'Off'); //send button status to server (as 1 or 0)
    });

    slider.oninput = function () {
        output.innerHTML = this.value;
    };
    slider.onchange = function () {
        if (cool.checked) {
            socket.emit('cool', this.value);
        }
        if (heat.checked) {
            socket.emit('heat', this.value);
        }
    };
});