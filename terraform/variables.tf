// terraform/variables.tf

variable "resource_group_name" {
  type        = string
  description = "The name of the resource group in which to create all resources."
  default     = "rg-insurance-demo"
}

variable "primary_location" {
  type        = string
  description = "The primary Azure region."
  default     = "East US"
}

variable "secondary_location" {
  type        = string
  description = "The secondary Azure region for geo-redundancy."
  default     = "Central US"
}

variable "vnet_name" {
  type        = string
  description = "Name of the Virtual Network."
  default     = "vnet-insurance"
}

variable "address_space" {
  type        = string
  description = "Address space for the VNet."
  default     = "10.0.0.0/16"
}

variable "gateway_subnet_prefix" {
  type        = string
  description = "Address prefix for the App Gateway subnet."
  default     = "10.0.1.0/24"
}

variable "app_subnet_prefix" {
  type        = string
  description = "Address prefix for App Services subnet."
  default     = "10.0.2.0/24"
}

variable "private_subnet_prefix" {
  type        = string
  description = "Address prefix for the Private Endpoint subnet."
  default     = "10.0.3.0/24"
}

variable "sql_server_name" {
  type        = string
  description = "Name of the Azure SQL Server."
  default     = "sqlserver-insurance-demo"
}

variable "sql_database_name" {
  type        = string
  description = "Name of the Azure SQL Database."
  default     = "sqldb-insurance-claims"
}

variable "sql_admin_username" {
  type        = string
  description = "The administrator username of the SQL logical server."
  default     = "sqladminuser"
}

variable "sql_admin_password" {
  type        = string
  description = "The administrator password of the SQL logical server."
  sensitive   = true
}

variable "frontend_app_name" {
  type        = string
  description = "Name of the Frontend App Service."
  default     = "app-insurance-frontend-demo"
}

variable "claim_service_app_name" {
  type        = string
  description = "Name of the Claim Service App Service."
  default     = "app-insurance-claim-demo"
}

variable "document_service_app_name" {
  type        = string
  description = "Name of the Document Service App Service."
  default     = "app-insurance-document-demo"
}

variable "function_app_name" {
  type        = string
  description = "Name of the Function App for Blob replication."
  default     = "func-insurance-repl-demo"
}
