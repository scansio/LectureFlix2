#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if [ "$( whoami )" != "root" ]; then
    echo "Error: This script must be run with sudo or su."
    exit 1
fi

if [ $# -eq 0 ]; then
    echo "Error: Specify user for which to install service."
    exit 1
fi

CURRENT_USER="$1"

$SCRIPT_DIR/uninstall_service.sh

# Main server ---------------------------------------------------------------
mkdir -p /etc/systemd/system/

# Replace <ROOT_PATH> in liftMainServer.service and save to /etc/systemd/system/liftMainServer.service
sed "s|<ROOT_PATH>|$SCRIPT_DIR|g" "$SCRIPT_DIR/liftMainServer.service" > /etc/systemd/system/liftMainServer.service

sed "s|<CURRENT_USER>|$CURRENT_USER|g" "/etc/systemd/system/liftMainServer.service" > /tmp/liftMainServer.service.tmp
mv "/tmp/liftMainServer.service.tmp" "/etc/systemd/system/liftMainServer.service"

chmod +x /etc/systemd/system/liftMainServer.service


# Repo server ---------------------------------------------------------------

# Replace <ROOT_PATH> in liftRepoServer.service and save to /etc/systemd/system/liftRepoServer.service
sed "s|<ROOT_PATH>|$SCRIPT_DIR|g" "$SCRIPT_DIR/liftRepoServer.service" > /etc/systemd/system/liftRepoServer.service

sed "s|<CURRENT_USER>|$CURRENT_USER|g" "/etc/systemd/system/liftRepoServer.service" > /tmp/liftRepoServer.service.tmp
mv "/tmp/liftRepoServer.service.tmp" "/etc/systemd/system/liftRepoServer.service"

# Ensure correct permissions for the service and script
chmod +x /etc/systemd/system/liftRepoServer.service


# CDN server ---------------------------------------------------------------

# Replace <ROOT_PATH> in liftCdnServer.service and save to /etc/systemd/system/liftCdnServer.service
sed "s|<ROOT_PATH>|$SCRIPT_DIR|g" "$SCRIPT_DIR/liftCdnServer.service" > /etc/systemd/system/liftCdnServer.service

sed "s|<CURRENT_USER>|$CURRENT_USER|g" "/etc/systemd/system/liftCdnServer.service" > /tmp/liftCdnServer.service.tmp
mv "/tmp/liftCdnServer.service.tmp" "/etc/systemd/system/liftCdnServer.service"

# Ensure correct permissions for the service and script
chmod +x /etc/systemd/system/liftCdnServer.service


# Scheduling servers ---------------------------------------------------------------

# Replace <ROOT_PATH> in liftSchedulingServer.service and save to /etc/systemd/system/liftSchedulingServer.service
sed "s|<ROOT_PATH>|$SCRIPT_DIR|g" "$SCRIPT_DIR/liftSchedulingServer.service" > /etc/systemd/system/liftSchedulingServer.service

sed "s|<CURRENT_USER>|$CURRENT_USER|g" "/etc/systemd/system/liftSchedulingServer.service" > /tmp/liftSchedulingServer.service.tmp
mv "/tmp/liftSchedulingServer.service.tmp" "/etc/systemd/system/liftSchedulingServer.service"

# Ensure correct permissions for the service and script
chmod +x /etc/systemd/system/liftSchedulingServer.service


# Socket Server ---------------------------------------------------------------

# Replace <ROOT_PATH> in lift.service and save to /etc/systemd/system/lift.service
sed "s|<ROOT_PATH>|$SCRIPT_DIR|g" "$SCRIPT_DIR/liftSocketServer.service" > /etc/systemd/system/liftSocketServer.service

sed "s|<CURRENT_USER>|$CURRENT_USER|g" "/etc/systemd/system/liftSocketServer.service" > /tmp/liftSocketServer.service.tmp
mv "/tmp/liftSocketServer.service.tmp" "/etc/systemd/system/liftSocketServer.service"

# Ensure correct permissions for the service and script
chmod +x /etc/systemd/system/liftSocketServer.service

$SCRIPT_DIR/init.sh $CURRENT_USER

# Reload systemd to apply changes
systemctl daemon-reload


systemctl enable liftMainServer.service
systemctl restart liftMainServer.service

systemctl enable liftRepoServer.service
systemctl restart liftRepoServer.service

systemctl enable liftCdnServer.service
systemctl restart liftCdnServer.service

systemctl enable liftSchedulingServer.service
systemctl restart liftSchedulingServer.service

systemctl enable liftSocketServer.service
systemctl restart liftSocketServer.service

echo "Service installed with ExecStart path: $SCRIPT_DIR"
