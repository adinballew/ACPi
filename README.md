# ACPi
Web Interface for Monitoring Temperature and Humidity using TI SensorTag CC2650 and Controlling PTAC AC Unit Over Raspberry Pi.
Uses 4 Channel Relay Controlled using GPIO Pins.

Home
![screenshot1](./screenshot1.PNG)

Recent Data
![screenshot2](./screenshot2.PNG)

## Installation
Clone package or download zip file.
```npm
npm install
```

## Configuration
You'll need:
1. Firebase
    1. Cloud Firestore
    2. Service Account Key JSON file
2. Google Calendar
    1. Service Account Key JSON file
3. Bluez Installed on Raspberry Pi
4. PM2 Installed on Rasberry Pi (For unexpected outages)

## License
[MIT](https://choosealicense.com/licenses/mit/)