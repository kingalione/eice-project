let Tinkerforge = require('tinkerforge');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let system = require('reboot');

let HOST = 'localhost';
let PORT = 4223;

let ipcon = new Tinkerforge.IPConnection(); // Create IP connection
let acc = new Tinkerforge.BrickletAccelerometer('uu5', ipcon); // Create device object
var al = new Tinkerforge.BrickletAmbientLightV2('uu4', ipcon);
var tem = new Tinkerforge.BrickletTemperature('uu3', ipcon); // Create device object

io.on('connection', function(socket) {
  socket.on('reconnect-master-brick', function() {
    ipcon.disconnect();
    console.log('Master Brick disconnected.');

    ipcon.connect(HOST, PORT, function(error) {
      console.log('Error: ' + error);
    });
  });

  socket.on('reboot', function() {
    console.log('Rebooting system...');
    system.reboot();
  });
});

ipcon.connect(HOST, PORT, function(error) {
  console.log('Error: ' + error);
}); // Connect to brickd
// Don't use device before ipcon is connected

ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED, function(connectReason) {
  // Set period for acceleration callback to 1s (1000ms)
  // Note: The acceleration callback is only called every second
  //       if the acceleration has changed since the last call!
  // use differenet pirmenumber callbackperiods to avoid conflicts
  al.setIlluminanceCallbackPeriod(911);
  acc.setAccelerationCallbackPeriod(1373);
  tem.setTemperatureCallbackPeriod(683);
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
  res.send('<h1>TinkerForge Sensors Server is online :-)</h1>');
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

console.log('Press any key to exit');
process.stdin.on('data', function(data) {
  ipcon.disconnect();
  process.exit(0);
});
