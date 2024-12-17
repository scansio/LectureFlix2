#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if [ $# -eq 0 ]; then
    echo "Error: Specify user for which to install service."
    exit 1
fi

CURRENT_USER="$1"

sed "s|<ROOT_PATH>|$SCRIPT_DIR/../|g" "$SCRIPT_DIR/start-server-tmp.sh" > "$SCRIPT_DIR/start-server.sh"
sed "s|<ROOT_PATH>|$SCRIPT_DIR/../|g" "$SCRIPT_DIR/stop-server-tmp.sh" > "$SCRIPT_DIR/stop-server.sh"
chmod +x "$SCRIPT_DIR/start-server.sh"
chmod +x "$SCRIPT_DIR/stop-server.sh"

chown -R $CURRENT_USER:$CURRENT_USER $SCRIPT_DIR

chmod -R 744 $SCRIPT_DIR