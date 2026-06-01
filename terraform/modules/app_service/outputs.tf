output "app_id" {
  value = azurerm_linux_web_app.app.id
}

output "app_name" {
  value = azurerm_linux_web_app.app.name
}

output "default_hostname" {
  value = azurerm_linux_web_app.app.default_hostname
}
