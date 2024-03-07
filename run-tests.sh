#!/bin/bash
# shopt -s globstar

# while getopts "u:t:" flag; do
#   case $flag in
#   u) BASE_URL="$OPTARG" ;;
#   t) TESTS="$OPTARG" ;;
#   esac
# done

export K6_BROWSER_HEADLESS=true 
export K6_BROWSER_ARGS='no-sandbox' 
export K6_BROWSER_EXECUTABLE_PATH=/usr/bin/google-chrome

k6 run scripts/web2.js


