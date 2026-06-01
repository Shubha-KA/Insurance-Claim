resource "azurerm_linux_function_app" "function" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location

  storage_account_name       = var.storage_account_name
  storage_account_access_key = data.azurerm_storage_account.storage.primary_access_key
  service_plan_id            = var.app_service_plan_id

  site_config {
    application_stack {
      node_version = "20"
    }
  }
}

data "azurerm_storage_account" "storage" {
  name                = var.storage_account_name
  resource_group_name = var.resource_group_name
}
