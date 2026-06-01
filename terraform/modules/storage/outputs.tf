output "primary_storage_account_id" {
  value = azurerm_storage_account.primary.id
}

output "primary_storage_account_name" {
  value = azurerm_storage_account.primary.name
}

output "secondary_storage_account_id" {
  value = azurerm_storage_account.secondary.id
}

output "container_name" {
  value = azurerm_storage_container.primary_container.name
}
