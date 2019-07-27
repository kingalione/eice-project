# TinkerForge Sensor NodeJs Server

## Install the server on linux machine

1. install git
2. run `git clone https://github.com/kingalione/eice-project`
3. install nodejs, npm, supervisord
4. configure hostname to `tf-sensors-raspi-1.local`
5. install tinkerforge brickdaemon `brickd` by following the instructions given at: https://www.tinkerforge.com/de/doc/Software/Brickd_Install_Linux.html#brickd-install-linux

6. create supervisor config in `/etc/supervisor/conf.d/` like this:

```
[program:tf-sensors]
directory=<<PATH_TO_PROJECT_DIR>>
command=node server.js
autostart=true
autorestart=true
stderr_logfile=/var/log/tf-sensors.err.log
```

7. go to project directory of this new repo
8. run `npm install`
9. reboot system with `sudo shutdown -r 0`
10. open mobile app

## update the server

1. go into the project directory `<<PATCH_TO_PROJECT_DIR>>/server`
2. run `git pull`
3. run `nmp install`
4. reboot system with `sudo shutdown -r 0`
