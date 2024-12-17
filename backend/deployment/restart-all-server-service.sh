#! /bin/sh

sudo systemctl restart liftMainServer.service

sudo systemctl restart liftSocketServer.service

sudo systemctl restart liftRepoServer.service

sudo systemctl restart liftCdnServer.service

sudo systemctl restart liftSchedulingServer.service
