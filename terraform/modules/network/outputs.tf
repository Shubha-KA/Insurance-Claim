output "vnet_id" {
  value = azurerm_virtual_network.vnet.id
}

output "app_gateway_subnet_id" {
  value = azurerm_subnet.appgw_subnet.id
}

output "private_endpoint_subnet_id" {
  value = azurerm_subnet.private_endpoint_subnet.id
}

output "app_subnet_id" {
  value = azurerm_subnet.app_subnet.id
}
