# Setup

## Requirements

- Terraform
- Docker
- k3d
- Helm
- kubectl

## Steps

First create the k3d cluster and import the docker image into it

```bash
k3d cluster create cybersec --port '8080:80@loadbalancer'

cd app/backend

docker build . -t secure-containers/my-app
k3d image import secure-containers/my-app -c cybersec

cd -
```

Next create the `terraform.tfvars` file with your database configuration, then run the terraform module just like this:

```bash
cat << 'EOF' > terraform.tfvars
dbconfig = {
  "database": <Database name>,
  "password": <Database password>,
  "username": <Database user>
}

EOF

terraform init
terraform apply
```


To apply the monitoring stack do these commands: 

```bash
# Create the namespace and CRDs, and then wait for them to be availble before creating the remaining resources
kubectl create -f manifests/monitoring/setup

# Wait until the "servicemonitors" CRD is created. The message "No resources found" means success in this context.
until kubectl get servicemonitors --all-namespaces ; do date; sleep 1; echo ""; done

kubectl create -f manifests/monitoring
```

Acess grafana with the following command, it will be available on [http://localhost:3000](http://localhost:3000) the creadentials are `admin/admin`:

```bash
kubectl --namespace monitoring port-forward svc/grafana 3000
```


## Exploits 

- [Pod escape with logs](https://github.com/danielsagi/kube-pod-escape)
- [Reverse shell](https://sysdig.com/learn-cloud-native/detection-and-response/what-is-a-reverse-shell/)
