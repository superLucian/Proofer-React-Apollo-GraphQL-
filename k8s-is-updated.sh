#!/bin/bash
export BASE=$1
export SUFFIX=$2

if [ -z $BASE ]; then
	echo "Usage: ./k8s-us-updated.sh [service] [?suffix]"
	exit 1
fi

function isUpdateComplete {
	availablePods="$(kubectl get deployment ${1} -o jsonpath='{.status.availableReplicas}')"
	targetPods="$(kubectl get deployment ${1} -o jsonpath='{.status.replicas}')"
	if [ "$availablePods" = "$targetPods" ]
	then
		return 0
	fi
	return 1
}

function waitForUpdate {
	for (( c=1; c<=120; c++ ))
	do
		if isUpdateComplete "$1"; then
			echo " - Deploy completed"
			return 0
		fi
		printf "."
		sleep 1
	done

	echo " - ERROR! Timeout after 120 seconds"
	exit 1
}

echo "Waiting for services to deploy:"
	
waitForUpdate "$BASE$SUFFIX"

echo "Done."