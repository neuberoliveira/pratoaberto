#!/bin/bash
# source $HOME/.zshrc
source .env

node_exec=$(which node)
script_dir=$(dirname "$0")
script_file="$script_dir/index.js"

cd $script_dir
$node_exec $script_file
# cp "$script_dir/*.xls" "$HOME/Desktop/"
