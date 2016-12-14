# Chrome #

Since Firefox comes with Websockets "disabled:"https://developer.mozilla.org/en/WebSockets", even though there's a way to enable it through:
  a. go to about:config
  b. set network.websocket.enabled to true
  c. set network.websocket.override-security-block to true.
  d. restart Firefox

But it's still easier to support Chrome by default.
In order to get it to work:
  a. download Chrome itself from "http://www.google.com/landing/chrome/beta/":"http://www.google.com/landing/chrome/beta/" (yes, it's Beta, but Selenium Webdriver only supports that version for now)
  b. download Chrome Driver from "http://code.google.com/p/selenium/downloads/list":"http://code.google.com/p/selenium/downloads/list"
  c. unzip your stuff anywhere and add that dir to your PATH

## Mac OS X warning ##

There is a bug in this initial version of the chromedriver where it explicitly checks for Chromium instead of Google Chrome.  To use it with Google Chrome:


    ln -s "/Applications/Google Chrome.app"/ \
        "/Applications/Chromium.app"
    ln -s "/Applications/Chromium.app/Contents/MacOS/Google Chrome" \
        "/Applications/Chromium.app/Contents/MacOS/Chromium"

## Running features on CI ##

In order to run features on the headless server, Xvfb fake display driver should be installed. On debian-based system it's Xvfb.
Here's a very basic runner script (for /etc/init.d/xvfb). Please install package and create appropriate user beforehand.

    #!/bin/sh
    #
    # /etc/init.d/xvfb -  startup script for xvfb</code>
    USERNAME=xvfb
    NAME=xvfbd
    DAEMON=/usr/bin/Xvfb
    PIDFILE=/var/run/$NAME.pid

    export JAVA_HOME=/usr
    case $1 in
        start)
          start-stop-daemon -c $USERNAME -d /home/$USERNAME --start --name $NAME --background --pidfile $PIDFILE --exec /usr/bin/Xvfb -- :99 -ac \
                  || return 2
            ;;

        stop)
          killall Xvfb
            ;;
    esac

    exit 0
