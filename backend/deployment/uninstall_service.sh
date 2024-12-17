#!/bin/bash

sudo systemctl stop liftMainServer.service
sudo systemctl stop liftRepoServer.service
sudo systemctl stop liftCdnServer.service
sudo systemctl stop liftSchedulingServer.service
sudo systemctl stop liftSocketServer.service

sudo systemctl disable liftMainServer.service
sudo systemctl disable liftRepoServer.service
sudo systemctl disable liftCdnServer.service
sudo systemctl disable liftSchedulingServer.service
sudo systemctl disable liftSocketServer.service

sudo rm /etc/systemd/system/liftMainServer.service
sudo rm /etc/systemd/system/liftRepoServer.service
sudo rm /etc/systemd/system/liftCdnServer.service
sudo rm /etc/systemd/system/liftSchedulingServer.service
sudo rm /etc/systemd/system/liftSocketServer.service

# This command will rotate the logs, keeping only the current logs and moving the old logs to an archive.
sudo journalctl --rotate
#This command will remove log data older than 1 second, effectively deleting old logs and freeing up disk space.
sudo journalctl --vacuum-time=1s
