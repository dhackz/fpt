gemgemgem <- an awesome project!

Install KIND:
`https://kind.sigs.k8s.io/docs/user/quick-start/`

Install kubectl:
`https://kubernetes.io/docs/tasks/tools/install-kubectl/`

Create kind cluster with a node configured to expose prot 80 and 443:

```
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```

Install nginx ingress to the cluster:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml`

Build docker images and load them into kind:

```
docker build backend --tag fpt/fpt-backend:dev
docker build frontend --tag fpt/fpt-frontend:dev
kind load docker-image fpt/fpt-backend:dev
kind load docker-image fpt/fpt-frontend:dev
```

Install helm charts:
`helm install fpt ./fpt-charts`

Delete pods whenever you load a new version of a container:
`kubectl delete pods -l app=fpt-frontend`
or
`kubectl delete pods -l app=fpt-backend`
