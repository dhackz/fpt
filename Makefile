HELM_NAME=fpt-dev
KUBE_CONTEXT=kind-kind

.PHONY: install uninstall upgrade backend frontend load

uninstall:
	helm --kube-context=$(KUBE_CONTEXT) install $(HELM_NAME) ./fpt-charts

install: backend frontend load
	helm --kube-context=$(KUBE_CONTEXT) upgrade --install --devel $(HELM_NAME) ./fpt-charts
	kubectl --context=$(KUBE_CONTEXT) delete pods -l app=fpt-frontend
	kubectl --context=$(KUBE_CONTEXT) delete pods -l app=fpt-backend

backend:
	docker build backend --tag fpt/fpt-backend:dev

frontend:
	docker build frontend --tag fpt/fpt-frontend:dev

load:
	kind load docker-image fpt/fpt-backend:dev
	kind load docker-image fpt/fpt-frontend:dev
