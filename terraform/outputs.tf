output "storage_account_prod_primary_connection_string" {
  value     = azurerm_storage_account.storage-account-prod.primary_connection_string
  sensitive = true
}

output "storage_account_dev_primary_connection_string" {
  value     = azurerm_storage_account.storage-account-dev.primary_connection_string
  sensitive = true
}
