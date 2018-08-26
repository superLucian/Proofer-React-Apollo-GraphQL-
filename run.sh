#!/bin/bash
export ENV=$1
export KUBECONFIG_VALUES

if [ -z $ENV ]; then
	echo "Usage: ./run.sh [environment] {dev|test.local|test.buddy|acc|prod}"
	exit 1
elif [ $ENV = "dev" ]; then
	KUBECONFIG_VALUES="dev.config"
	# Build Docker images
	./build.sh ${ENV}
elif [ $ENV = "test.local" ]; then
	KUBECONFIG_VALUES="test.local.config"
	# Build Docker images
	./build.sh ${ENV}
elif [ $ENV = "test.buddy" ]; then
	KUBECONFIG_VALUES="test.buddy.config"
	./build.sh ${ENV}
elif [ $ENV = "acc" ]; then
	KUBECONFIG_VALUES="acc.config"	
	./build.sh ${ENV}
elif [ $ENV = "prod" ]; then
	KUBECONFIG_VALUES="prod.config"	
	./build.sh ${ENV}
else
	echo "Error: invalid environment given"
	exit 1
fi

./k8s-build.sh $ENV

kubectl apply -f kubernetes/generated