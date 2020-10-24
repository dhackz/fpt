# gemgemgem <- an awesome project!
![Build](https://github.com/dhackz/fpt/workflows/build-containers/badge.svg)
![Integration](https://github.com/dhackz/fpt/workflows/Create%20cluster%20using%20KinD/badge.svg)



## Getting started

### Install KIND:

`https://kind.sigs.k8s.io/docs/user/quick-start/`

### Install kubectl:

`https://kubernetes.io/docs/tasks/tools/install-kubectl/`

### Install helm:

`https://github.com/helm/helm/releases`


### Create kind cluster with ingress config:

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


### Install nginx ingress to the cluster:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml`


### Make commands for KIND:
- `install` build containers and install helm charts
- `uninstall` uninstall helm charts
- `frontend` build frontend and tag with fpt/fpt-frontend:dev
- `backend` build backend and tag with fpt/fpt-backend:dev
- `load` load fpt/fpt-frontend:dev and fpt/fpt-backend:dev into kind.
