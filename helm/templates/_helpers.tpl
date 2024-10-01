{{/*
Expand the name of the chart.
*/}}
{{- define "space.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "space.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "space.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "space.labels" -}}
helm.sh/chart: {{ include "space.chart" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "space.selectorLabelsFrontend" -}}
app.kubernetes.io/name: {{ include "space.name" . }}-frontend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{- define "space.selectorLabelsBackend" -}}
app.kubernetes.io/name: {{ include "space.name" . }}-backend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{- define "space.selectorLabelsDatabase" -}}
app.kubernetes.io/name: {{ include "space.name" . }}-database
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "space.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "space.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
