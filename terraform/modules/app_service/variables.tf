variable "name" {
  type = string
}

variable "resource_group_name" {
  type = string
  default = "rg-insurance-demo"
}

variable "location" {
  type = string
}

variable "app_service_plan_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "app_settings" {
  type = map(string)
  default = {}
}
