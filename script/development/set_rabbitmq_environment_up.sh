#!/bin/sh

rabbitmqctl add_vhost "travisci.development"
rabbitmqctl add_user travisci_server travisci_server_password
rabbitmqctl set_permissions -p "travisci.development" travisci_server ".*" ".*" ".*"

rabbitmqctl set_permissions -p "travisci.development" guest ".*" ".*" ".*"
