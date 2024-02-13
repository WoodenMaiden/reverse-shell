terraform {
  required_providers {
    helm = {
      source  = "hashicorp/helm"
      version = "2.12.1"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.25.2"
    }
  }
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "helm_release" "kyverno" {
  count      = var.enable_kyverno ? 1 : 0
  name       = "kyverno"
  repository = "https://kyverno.github.io/kyverno/"
  chart      = "kyverno"

  create_namespace = true
  namespace        = "kyverno"
}

resource "helm_release" "webapp" {
  name  = "webapp"
  chart = "./app/backend/helm"

  values = [file("${path.module}/app/backend/helm/values.yaml")]

  dynamic "set" {
    for_each = var.dbconfig
    content {
      name  = "postgres.${set.key}"
      value = set.value
    }
  }

  set {
    name  = "postgres.host"
    value = "database-postgresql"
  }

  depends_on = [helm_release.consul]

}

resource "helm_release" "database" {
  name  = "database"
  chart = "./app/postgresql"

  values = [file("${path.module}/app/postgresql/values.yaml")]

  dynamic "set" {
    for_each = var.dbconfig
    content {
      name  = "auth.${set.key}"
      value = set.value
    }
  }
  depends_on = [helm_release.consul]
}

resource "helm_release" "consul" {
  count = var.enable_consul ? 1 : 0

  repository = "https://helm.releases.hashicorp.com"
  chart      = "consul"

  name = "consul"

  namespace        = "consul"
  create_namespace = true

  set {
    name  = "server.bootstrapExpect"
    value = 1
  }

  set {
    name  = "ui.enabled"
    value = true
  }

  set {
    name  = "ui.ingress.enabled"
    value = true
  }

  set {
    name  = "ui.ingress.hosts[0].host"
    value = "consul.127.0.0.1.sslip.io"
  }

  set {
    name = "connectInject.apiGateway.managedGatewayClass.serviceType"
    value = "LoadBalancer"
  }

  # set {
  #   name = "global.acls.manageSystemACLs"
  #   value = true
  # }
}

resource "helm_release" "kubeview" {
  repository = "https://kubeview.benco.io/charts/"
  chart      = "kubeview"

  name             = "kubeview"
  namespace        = "kubeview"
  create_namespace = true

  set {
    name  = "ingress.enabled"
    value = true
  }

  set {
    name  = "ingress.hosts[0].host"
    value = "viz.127.0.0.1.sslip.io"
  }
}


variable "dbconfig" {
  type = object({
    database = string
    username = string
    password = string
  })
}

variable "enable_kyverno" {
  type    = bool
  default = false
}


variable "enable_consul" {
  type    = bool
  default = false
}