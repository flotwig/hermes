#!/bin/bash

# Error: Cannot find module '/home/zach/Projects/hermes/node_modules/sqlite3/lib/binding/electron-v2.0-linux-x64/node_sqlite3.node'
#
# ➜  hermes git:(master) ✗ ls node_modules/sqlite3/lib/binding/electron-v2.0-linux-x64
#
# 🤔 hmm...

if [[ ! -d ./node_modules/sqlite3/lib/binding/electron-v2.0-linux-x64 ]] ; then
    echo "🤔 Building sqlite3 native extension for Electron"
    ./node_modules/.bin/electron-rebuild
else
    echo "🤔 sqlite3 native extension for Electron already built, skipping"
fi

