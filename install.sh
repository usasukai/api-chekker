#!/bin/bash
PASSWROD="hoge"
 curl -fsSL https://rpm.nodesource.com/setup_18.x |sudo -S bash -
 echo $PASSWROD| sudo -S yum install nodejs
 npm install


