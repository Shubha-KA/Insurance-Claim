output "frontend_app_url" {
  value = "https://${module.frontend_app.default_hostname}"
}

output "app_gateway_public_ip" {
  value = module.app_gateway.app_gateway_id
}

output "primary_storage_account" {
  value = module.storage.primary_storage_account_name
}
