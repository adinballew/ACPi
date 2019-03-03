const socket = io();

const table = new Tabulator("#recent-table", {
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector:[10, 25, 50, 100],
    index: "Date",
    columns: [
        {
            title: "Date", field: "Date", sorter: "time", formatter: "datetime", formatterParams: {
                outputFormat: "YYYY/MM/DD",
                invalidPlaceholder: "(invalid date)"
            },
            sorterParams: {
                outputFormat: "HH:MM:SS"
            }, width: 300
        },
        {title: "Temperature", field: "Temperature", sorter: "number", align: "left"},
        {
            title: "Humidity", field: "Humidity", sorter: "number", formatter: "progress", formatterParams: {
                min: 0,
                max: 100
            }, width: 300
        },
        {title: "Pressure", field: "Pressure", sorter: "number", align: "left"},
        {title: "Lux", field: "Lux", sorter: "number", align: "left"},
    ],
});
//TODO: Add a fixed size to the number of record in the table.
socket.on("dbData", function (data) {
    //Receives the emitted state signal from the controller
    table.updateOrAddData(data.recentData)
});