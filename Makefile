.PHONY: help
help: ## Show this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"; printf "\Targets:\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m	 %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: load
load: ## Loads the go dummy container to the minikube cluster
	minikube image load golang:alpine

.PHONY: init
init: ## Initializes the streams-nodejs namespace on the minikube cluster
	kubectl apply -f .k8s/0-namespace.yml
	kubectl apply -f .k8s/1-service.yml
	kubectl apply -f .k8s/2-deployment.yml

.PHONY: stop
stop: ## Stops the streams-nodejs services deployment on the minikube cluster
	kubectl scale deploy -n streams-nodejs streams-nodejs --replicas=0

.PHONY: start
start: ## Starts the streamss-nodejs services deployment on the minikube cluster
	kubectl scale deploy -n streams-nodejs streams-nodejs --replicas=1

.PHONY: dev
dev: ## Runs the streams-nodejs dev environment on the minikube cluster
	okteto up -n streams-nodejs -f .okteto.yml

.PHONY: dev-stop
dev-stop: ## Removes the streams-nodejs services dev environment from the minikube cluster
	okteto down -n streams-nodejs -f .okteto.yml

.PHONY: clean
clean: ## Removes the services-nodejs from the minikube cluster
	okteto down -n streams-nodejs -f .okteto.yml -v

	kubectl delete -f .k8s/2-deployment.yml
	kubectl delete -f .k8s/1-service.yml
	kubectl delete -f .k8s/0-namespace.yml

.PHONY: protobuf
protobuf: ## Generates clientchannel protobuf code
	./protobuf.sh

.PHONY: lint
lint: ## Run linters
	npm run format
	npm run lint
