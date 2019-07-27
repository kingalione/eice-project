let Tinkerforge = require('tinkerforge');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let HOST = 'localhost';
let PORT = 4223;

let ipcon = new Tinkerforge.IPConnection(); // Create IP connection
let acc = new Tinkerforge.BrickletAccelerometer('uu5', ipcon); // Create device object
var al = new Tinkerforge.BrickletAmbientLightV2('uu4', ipcon);
var tem = new Tinkerforge.BrickletTemperature('uu3', ipcon); // Create device object

ipcon.connect(HOST, PORT, function(error) {
  console.log('Error: ' + error);
}); // Connect to brickd
// Don't use device before ipcon is connected

ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED, function(connectReason) {
  // Set period for acceleration callback to 1s (1000ms)
  // Note: The acceleration callback is only called every second
  //       if the acceleration has changed since the last call!
  al.setIlluminanceCallbackPeriod(1000);
  acc.setAccelerationCallbackPeriod(1000);
  tem.setTemperatureCallbackPeriod(1000);
});

//Register acceleration callback
acc.on(
  Tinkerforge.BrickletAccelerometer.CALLBACK_ACCELERATION,
  // Callback function for acceleration callback
  (x, y, z) => {
    console.log('Acceleration [X]: ' + x / 1000.0 + ' g');
    console.log('Acceleration [Y]: ' + y / 1000.0 + ' g');
    console.log('Acceleration [Z]: ' + z / 1000.0 + ' g');
    console.log();

    //emit socket event
    io.emit('update-acc', [x / 1000.0, y / 1000.0, z / 1000.0]);
  }
);

// Register illuminance callback
al.on(
  Tinkerforge.BrickletAmbientLightV2.CALLBACK_ILLUMINANCE,
  // Callback function for illuminance callback
  illuminance => {
    console.log('Illuminance: ' + illuminance / 100.0 + ' lx');
    console.log();

    io.emit('update-illuminance', illuminance / 100.0);
  }
);

//Register temperature callback
tem.on(
  Tinkerforge.BrickletTemperature.CALLBACK_TEMPERATURE,
  // Callback function for temperature callback
  temperature => {
    console.log('Temperature: ' + temperature / 100.0 + ' °C');
    console.log();

    io.emit('update-temperature', temperature / 100.0);
  }
);

app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

console.log('Press key to exit');
process.stdin.on('data', function(data) {
  ipcon.disconnect();
  process.exit(0);
});
