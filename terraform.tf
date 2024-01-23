terraform {
  required_providers {
    helm = {
      source  = "hashicorp/helm"
      version = "2.12.1"
    }
  }
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

resource "helm_release" "php" {
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

  depends_on = [helm_release.database]

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
}

variable "dbconfig" {
  type = object({
    database = string
    username = string
    password = string
  })
}
