# Product Module

## APIs

### Create Product

POST /products

Authorization:
ADMIN


### Get Product

GET /products/:id


### Get Products

GET /products?page=1&limit=10&search=iphone


## Business Rules

1. SKU must be unique
2. Category must exist
3. Price stored as Decimal
4. Product response converts Decimal to number