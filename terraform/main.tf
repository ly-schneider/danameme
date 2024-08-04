# -------- PROD ENVIRONMENT --------

# Create a storage account
resource "azurerm_storage_account" "storage-account-prod" {
  name                            = "proddanameme"
  resource_group_name             = "PROD-Storage"
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = false
  is_hns_enabled                  = true

  tags = {
    STAGE = "PROD"
  }
}

# Create a container 
resource "azurerm_storage_container" "container-default-prod" {
  name                  = "images"
  storage_account_name  = azurerm_storage_account.storage-account-prod.name
  container_access_type = "private"
}

# Manually create two directories in the container:
# - /posts
# - /profile-images



# -------- DEV ENVIRONMENT --------

# Create a storage account
resource "azurerm_storage_account" "storage-account-dev" {
  name                            = "devdanameme"
  resource_group_name             = "DEV-Storage"
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = false
  is_hns_enabled                  = true

  tags = {
    STAGE = "DEV"
  }
}

# Create a container
resource "azurerm_storage_container" "container-default-dev" {
  name                  = "images"
  storage_account_name  = azurerm_storage_account.storage-account-dev.name
  container_access_type = "private"
}

# Manually create two directories in the container:
# - /posts
# - /profile-images
