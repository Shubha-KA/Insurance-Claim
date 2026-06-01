// terraform/main.tf

terraform {
  required_version = ">= 1.6.0"
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "tfstateinsdemo"
    container_name       = "tfstate"
    key                  = "insurance-demo.tfstate"
  }
}

provider "azurerm" {
  features {}
}

module "network" {
  source                = "./modules/network"
  vnet_name             = var.vnet_name
  location              = var.primary_location
  resource_group_name   = var.resource_group_name
  address_space         = var.address_space
  gateway_subnet_prefix = var.gateway_subnet_prefix
  private_subnet_prefix = var.private_subnet_prefix
  app_subnet_prefix     = var.app_subnet_prefix
}

module "storage" {
  source = "./modules/storage"
  resource_group_name = var.resource_group_name
  primary_location    = var.primary_location
  secondary_location  = var.secondary_location
}

module "sql" {
  source = "./modules/sql"
  resource_group_name = var.resource_group_name
  location            = var.primary_location
  sql_server_name    = var.sql_server_name
  sql_database_name  = var.sql_database_name
  admin_username      = var.sql_admin_username
  admin_password      = var.sql_admin_password
}

module "app_gateway" {
  source = "./modules/app_gateway"
  resource_group_name = var.resource_group_name
  location            = var.primary_location
  subnet_id           = module.network.app_gateway_subnet_id
}

module "app_service_plan" {
  source = "./modules/app_service_plan"
  resource_group_name = var.resource_group_name
  location            = var.primary_location
}

module "frontend_app" {
  source = "./modules/app_service"
  name                = var.frontend_app_name
  app_service_plan_id = module.app_service_plan.plan_id
  location            = var.primary_location
  subnet_id           = module.network.app_subnet_id
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
  }
}

module "claim_service_app" {
  source = "./modules/app_service"
  name                = var.claim_service_app_name
  app_service_plan_id = module.app_service_plan.plan_id
  location            = var.primary_location
  subnet_id           = module.network.app_subnet_id
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
    "SQL_SERVER"                = module.sql.sql_server_name
    "SQL_DATABASE"               = module.sql.sql_database_name
    "SQL_USERNAME"              = var.sql_admin_username
    "SQL_PASSWORD"              = var.sql_admin_password
  }
}

module "document_service_app" {
  source = "./modules/app_service"
  name                = var.document_service_app_name
  app_service_plan_id = module.app_service_plan.plan_id
  location            = var.primary_location
  subnet_id           = module.network.app_subnet_id
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
    "STORAGE_ACCOUNT"          = module.storage.primary_storage_account_name
    "STORAGE_CONTAINER"         = module.storage.container_name
  }
}

module "event_grid" {
  source = "./modules/event_grid"
  resource_group_name = var.resource_group_name
  primary_storage_account_id = module.storage.primary_storage_account_id
  secondary_storage_account_id = module.storage.secondary_storage_account_id
  function_app_id = module.function_app.function_id
}

module "function_app" {
  source = "./modules/function"
  name                = var.function_app_name
  resource_group_name = var.resource_group_name
  location            = var.primary_location
  app_service_plan_id = module.app_service_plan.plan_id
  storage_account_name = module.storage.primary_storage_account_name
}
