#!/bin/bash

# Check if an argument is provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <minutes-ago>"
  exit 1
fi

# Get the minutes ago from the argument
minutes_ago=$1

# Get the timestamp for the specified time ago in the correct format for journalctl
timestamp=$(date -d "-$minutes_ago minutes" +"%Y-%m-%d %H:%M:%S")

# Run journalctl to display logs for the specified service since the specified time
journalctl --since "$timestamp" -u liftmongod.service
echo "\n\n"
journalctl --since "$timestamp" -u liftMainServer.service
echo "\n\n"
journalctl --since "$timestamp" -u liftRepoServer.service
echo "\n\n"
journalctl --since "$timestamp" -u liftCdnServer.service
echo "\n\n"
journalctl --since "$timestamp" -u liftSchedulingServer.service
echo "\n\n"
