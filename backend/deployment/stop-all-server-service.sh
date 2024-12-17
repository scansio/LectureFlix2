#! /bin/sh

sudo systemctl stop liftMainServer.service
sudo systemctl stop liftSocketServer.service
sudo systemctl stop liftRepoServer.service
sudo systemctl stop liftCdnServer.service
sudo systemctl stop liftSchedulingServer.service