#!/bin/bash
export ENV=$1
export SERVICE_NAME="frontend-react"
export REACT_IMAGE_NAME
export NGINX_IMAGE_NAME
export BUILD_ARG

if [ -z $ENV ]; then
	echo "Usage: ./build.sh [environment] {dev|test.local|test.buddy|acc|prod}"
	exit 1
elif [ $ENV = "dev" ]; then
	REACT_IMAGE_NAME="${SERVICE_NAME}:react"
	NGINX_IMAGE_NAME="${SERVICE_NAME}:nginx"
	BUILD_ARG="--build-arg nodeEnv=development"
elif [ $ENV = "test.local" ]; then
	REACT_IMAGE_NAME="${SERVICE_NAME}:react-test"
	NGINX_IMAGE_NAME="${SERVICE_NAME}:nginx-test"
	BUILD_ARG="--build-arg nodeEnv=test"
elif [ $ENV = "test.buddy" ]; then
	REACT_IMAGE_NAME="eu.gcr.io/proofer-160818/${SERVICE_NAME}:react-stag"
	NGINX_IMAGE_NAME="eu.gcr.io/proofer-160818/${SERVICE_NAME}:nginx-stag"
	BUILD_ARG="--build-arg nodeEnv=test"
elif [ $ENV = "acc" ]; then
	REACT_IMAGE_NAME="eu.gcr.io/proofer-160818/${SERVICE_NAME}:react-acc"
	NGINX_IMAGE_NAME="eu.gcr.io/proofer-160818/${SERVICE_NAME}:nginx-acc"
	BUILD_ARG="--build-arg nodeEnv=acceptance"

elif [ $ENV = "prod" ]; then
	REACT_IMAGE_NAME="eu.gcr.io/proofer-160818/${SERVICE_NAME}:react-prod"
	NGINX_IMAGE_NAME="eu.gcr.io/proofer-160818/${SERVICE_NAME}:nginx-prod"
	BUILD_ARG="--build-arg nodeEnv=production"
	
else
	echo "Error: invalid environment given"
	exit 1
fi

docker image build -t ${REACT_IMAGE_NAME} -f Dockerfile . ${BUILD_ARG}
docker image build -t ${NGINX_IMAGE_NAME} -f docker/nginx/Dockerfile .