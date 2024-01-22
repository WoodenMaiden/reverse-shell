{{/*
Expand the name of the chart.
*/}}
{{- define "my-php-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "my-php-app.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "my-php-app.labels" -}}
helm.sh/chart: {{ include "my-php-app.chart" . }}
{{ include "my-php-app.fullname" . | printf "app.kubernetes.io/name: %s" }}
{{ include "my-php-app.fullname" . | printf "app.kubernetes.io/instance: %s" }}
{{- end -}}

{{/*
Create selector labels
*/}}
{{- define "my-php-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "my-php-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}


{{/* Define the chart name and version. */}}
{{- define "my-php-app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}
