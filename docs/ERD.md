# ERD — Panela de Casa

```mermaid
erDiagram
  USERS ||--o{ CHEFS : hasOne
  USERS ||--o{ CUSTOMERS : hasOne
  CHEFS ||--o{ DISHES : has
  CHEFS ||--o{ MENUCATEGORIES : has
  MENUCATEGORIES ||--o{ MENUITEMS : has
  CUSTOMERS ||--o{ ORDERS : places
  CHEFS ||--o{ ORDERS : receives
  ORDERS ||--o{ ORDERITEMS : contains
  USERS ||--o{ RATINGS : writes
  CHEFS ||--o{ RATINGS : receives

  USERS {
    uuid id PK
    text email UK
    text passwordHash
    text role // 'customer' | 'chef' | 'admin'
    timestamp createdAt
  }
  CHEFS {
    uuid id PK, FK -> USERS.id
    text kitchenName
    text bio
    text cuisineTypes // csv or array
    text location // geo string (v1)
    jsonb openingHours
    boolean approved
    timestamp createdAt
  }
  CUSTOMERS {
    uuid id PK, FK -> USERS.id
    text defaultAddress
    timestamp createdAt
  }
  DISHES {
    uuid id PK
    uuid chefId FK -> CHEFS.id
    text type // 'ready' | 'alacarte'
    text name
    text description
    text[] ingredients
    numeric price
    text photoUrl
    int prepMinutes
    timestamp createdAt
  }
  MENUCATEGORIES {
    uuid id PK
    uuid chefId FK -> CHEFS.id
    text name
    int minSelect
    int maxSelect
  }
  MENUITEMS {
    uuid id PK
    uuid categoryId FK -> MENUCATEGORIES.id
    text name
    numeric price
  }
  ORDERS {
    uuid id PK
    uuid customerId FK -> CUSTOMERS.id
    uuid chefId FK -> CHEFS.id
    text status // 'new' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
    numeric subtotal
    numeric deliveryFee
    numeric total
    text deliveryAddress
    text paymentMethod // 'mock' | 'stripe' | 'pagseguro'
    timestamp createdAt
  }
  ORDERITEMS {
    uuid id PK
    uuid orderId FK -> ORDERS.id
    uuid dishId FK -> DISHES.id
    int quantity
    numeric unitPrice
    jsonb customizations
  }
  RATINGS {
    uuid id PK
    uuid customerId FK -> CUSTOMERS.id
    uuid chefId FK -> CHEFS.id
    int stars // 1..5
    text comment
    timestamp createdAt
  }
```
