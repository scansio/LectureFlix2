#!/bin/bash

if [ "$( whoami )" != "root" ]; then
    echo "Error: This script must be run with sudo or su."
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

$SCRIPT_DIR/uninstall_service.sh
rm -R $SCRIPT_DIR/../
