#! /bin/bash

ScriptPath=$0
Dir=$(cd $(dirname "$ScriptPath"); pwd)
Basename=$(basename "$ScriptPath")

echo
for f in $Dir/examples/*.js
do

  echo "$f:"

  echo
  $f $*
  echo
done




# ############################## end of file ############################# #

