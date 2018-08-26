#!/bin/bash
export ENV=$1
export REVISION=$2

if [ -z $ENV ]; then
	echo "Usage: ./k8s-build.sh [environment] {dev|test.local|test.buddy|acc|prod} [?revision]"
	exit 1
	
elif [ $ENV = "dev" ]; then
	KUBECONFIG_VALUES="dev.config"
	
elif [ $ENV = "test.local" ]; then
	KUBECONFIG_VALUES="test.local.config"
	
elif [ $ENV = "test.buddy" ]; then
	KUBECONFIG_VALUES="test.buddy.config"
	
elif [ $ENV = "acc" ]; then
	KUBECONFIG_VALUES="acc.config"	

elif [ $ENV = "prod" ]; then
	KUBECONFIG_VALUES="prod.config"	
	
else
	echo "Error: invalid environment given"
	exit 1
fi

echo "Building environment $ENV"
[ "$REVISION" != "" ] && echo " - and revision: $REVISION"


rm kubernetes/generated/*

if [ "$REVISION" != "" ]
then
	tmpfile=$(mktemp "/tmp/${KUBECONFIG_VALUES}.XXXXXX.tmp")
	cat kubernetes/${KUBECONFIG_VALUES} | sed "s/\"revision\": \"\",/\"revision\": \"-$REVISION\",/g" > "$tmpfile"
	pystache kubernetes/templates/deployment.mustache "$tmpfile" > kubernetes/generated/deployment.yml
	rm "$tmpfile"
else
	pystache kubernetes/templates/deployment.mustache kubernetes/${KUBECONFIG_VALUES} > kubernetes/generated/deployment.yml
fi

pystache kubernetes/templates/service.mustache kubernetes/${KUBECONFIG_VALUES} > kubernetes/generated/service.yml

echo "Done."