#!/bin/bash

set -e

cd initDB
npm install
node scripts.js
cd ../
