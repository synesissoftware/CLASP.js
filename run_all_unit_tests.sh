#! /bin/bash

ScriptPath=$0
Dir=$(cd $(dirname "$ScriptPath"); pwd)
Basename=$(basename "$ScriptPath")

cd $Dir

npm test

cd ->/dev/null


# ############################## end of file ############################# #

