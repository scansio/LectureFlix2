#!/bin/bash

PATH="./"

if [ -n "$1" ]; then
  $PATH="$1"
fi

df -h
echo "\n\n"
du -h --max-depth=1 $PATH