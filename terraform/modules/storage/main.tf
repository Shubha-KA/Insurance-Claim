resource "azurerm_storage_account" "primary" {
  name                     = "insuranceprimarysa${random_string.suffix.result}"
  resource_group_name      = var.resource_group_name
  location                 = var.primary_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_account" "secondary" {
  name                     = "insurancebackupsa${random_string.suffix.result}"
  resource_group_name      = var.resource_group_name
  location                 = var.secondary_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "primary_container" {
  name                  = "documents"
  storage_account_name  = azurerm_storage_account.primary.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "secondary_container" {
  name                  = "documents"
  storage_account_name  = azurerm_storage_account.secondary.name
  container_access_type = "private"
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}
