#!/bin/bash

# create a k3d cluster with definition file
k3d cluster create --config ./k3d/k3d-dev-cluster.yml

# create namespace for the argocd installation
kubectl create namespace argocd
# install argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# start the GitOps with creation of argo-cd app
kubectl -n argocd apply -f ./argocd/argocd-app.yml