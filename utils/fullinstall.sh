#!/bin/bash
clear
echo "============================================"
echo "HarmonyPay 0.1.1 Install and Setup Script"
echo "============================================"
# This script is used to install the full version of the application.
# check if npm is installed
FILE=`echo \`which npm\``
if [ ! -f "$FILE" ]; then
    echo "NodeJs/NPM is not installed, please install it before continue."
    exit 1
fi

# check if git is installed
FILE=`echo \`which git\``
if [ ! -f "$FILE" ]; then
    echo "Git is not installed, please install it before continue."
    exit 1
fi

# check if docker is installed
FILE=`echo \`which docker\``
if [ ! -f "$FILE" ]; then
    echo "Docker is not installed, please install it before continue."
    exit 1
fi

# check if pm2 is installed
FILE=`echo \`which pm2\``
if [ ! -f "$FILE" ]; then
    echo "PM2 is not installed, installing now..."
    sudo npm install pm2 -g
fi

# Increase the File Watcher System Limit in Node
MAXWATCHES=`cat /proc/sys/fs/inotify/max_user_watches`
if [ "$MAXWATCHES" = "8192" ]; then
    echo "Increasing max user watches"
    echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
fi

# Get ip address from the docker container
CURRENTIP=`hostname -I | awk '{print $1}'`
SERVERSECRET=`openssl rand -hex 32 | awk '{print $1}'`
SERVERURL="http:\/\/$CURRENTIP:3033"
SERVERURLAPI="http:\/\/$CURRENTIP:3033\/api\/v1"

# Clone the repository and install dependancies
echo "Cloning repository"
git clone https://github.com/sekmet/harmonypay-gateway-app.git harmonypay
cd harmonypay
echo "Installing dependencies"
cp ./utils/.env.sample .env
echo "Updating server information..."
perl -pi -e "s/SERVER_URL_API/$SERVERURLAPI/g" .env
perl -pi -e "s/SERVER_URL_NEXTAUTH/$SERVERURL/g" .env
perl -pi -e "s/SERVER_SECRET/$SERVERSECRET/g" .env
npm install
echo "Installing autosettlement agent dependencies"
cd autosettlement-agent
npm install
cd ..
echo "Installing payments monitor dependencies"
cd payments-monitor
npm install
cd ..
echo "Installing harmonypay gateway app dependencies"
cd harmonypay-gateway-app
cp ../utils/.env.sample .env
echo "Updating server information..."
perl -pi -e "s/SERVER_URL_API/$SERVERURLAPI/g" .env
perl -pi -e "s/SERVER_URL_NEXTAUTH/$SERVERURL/g" .env
perl -pi -e "s/SERVER_SECRET/$SERVERSECRET/g" .env
npm install
cd ..
echo "Building Harmonypay database"
cd utils
/bin/bash dbsetup.sh
cd ..
echo "Building Harmonypay gateway application."
npm run build:gateway
echo "Running Harmonypay gateway..."
npm run start