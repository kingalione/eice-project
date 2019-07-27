# TinkerForge Sensor NodeJs Server

## Install the server on linux machine

1. install git
2. run `git clone https://github.com/kingalione/eice-project`
3. install nodejs, npm, supervisord
4. install tinkerforge brickd by following instructions given at: https://www.tinkerforge.com/de/doc/Software/Brickd_Install_Linux.html#brickd-install-linux

5. create supervisor config in `/etc/supervisor/conf.d/` like this:

```
[program:tf-sensors]
directory=<<PATH_TO_PROJECT_DIR>>
command=node server.js
autostart=true
autorestart=true
stderr_logfile=/var/log/tf-sensors.err.log
```

6. go to project directory of this new repo
7. run `npm install`
8. reboot system with `sudo shutdown -r 0`
9. open app

## update the server

1. go into the project directory `<<PATCH_TO_PROJECT_DIR>>/server`
2. run `git pull`
3. run `nmp install`
4. reboot system with `sudo shutdown -r 0`
