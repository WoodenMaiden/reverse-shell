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
