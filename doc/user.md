# User API Spec

## Register User

Endpoint : **``POST``** /api/users

Request Body:

```json
{
    "username" : "tegar",
    "password" : "customer",
    "name" : "Tegar Manthofani",
    "email" : "tegar@customer.com",
    "roles" : "user", 
}
```

Response Body (Success):

```json
{
    "data" : {
        "username" : "tegar",
        "name" : "Tegar Manthofani",
        "email" : "tegar@customer.com"
    },
}
```

Response Body (Failed):

```json
{
    "errors" : "Username already registered"
}
```

## Login User

Endpoint : **``POST``** /api/login

Request Body:

```json
{
    "username" : "tegar",
    "password" : "customers",
}
```

Response Body (Success):

```json
{
    "data" : {
        "username" : "tegar",
        "name" : "Tegar Manthofani",
        "email" : "tegar@customer.com",
        "token" : "session_id_generated",
        "roles" : "user"
    },
}
```

Response Body (Failed):

```json
{
    "errors" : "Username or Password wrong"
}
```

## Get User

Endpoint : **``GET``** /api/users/account

Headers : 
- Authorization: token

Response Body (Success):

```json
{
    "data" : {
        "username" : "tegar",
        "name" : "Tegar Manthofani",
        "email" : "tegar@customer.com",
    }

}
```

Response Body (Failed):

```json
{
    "errors" : "Unauthorized"
}
```

## Update User

Endpoint : **``PATCH``** /api/users/account

Headers : 
- Authorization: token

Request Body:
```json
// All fields are optional
{
    "password" : "developers",
    "name" : "Tegar",
    "email" : "tegar@customer.com",
    "roles" : "user"
}
```

Response Body (Success):

```json
{
    "data" : {
        "username" : "tegar",
        "name" : "Tegar",
        "email" : "tegar@customer.com",
    },

}
```

Response Body (Failed):

```json
{
    "errors" : "Username not exist"
}
```

## Logout User

Endpoint : **``DELETE``** /api/users/account

Headers : 
- Authorization: token

Response Body (Success):

```json
{
    "data" : true
}
```

Response Body (Failed):

```json
{
    "errors" : "Server is Busy"
}
```

# Perfomed By Admin

## Search/Get User

Endpoint : **``GET``** /api/users

Query Params :
**All Optional
- username: string, find user by username.
- email: string, find user by email.
- name: string, find user by name.
- roles: string, find user by roles.

```json
{
    "data" : [
        {
            "username" : "tegar",
            "name" : "Tegar Manthofani",
            "email" : "tegar@customer.com",
            "roles" : "users"
        },
        {
            "username" : "tegarwoo",
            "name" : "Tegar woo",
            "email" : "tegar.woo@customer.com",
            "roles" : "users"
        }
    ]
}
```

## Update User

Endpoint : **``PATCH``** /api/users/:username

Headers : 
- Authorization: token

Request Body:
```json
// both fields are optional
{
    "password" : "developers",
    "name" : "Vice Owner",
    "email" : "vice.owner@restaurant.com",
    "roles" : "admin"
}
```

Response Body (Success):

```json
{
    "data" : {
        "username" : "viceowner",
        "name" : "Vice Owner",
        "email" : "vice.owner@restaurant.com",
        "roles" : "admin"
    },

}
```

Response Body (Failed):

```json
{
    "errors" : "Username not exist"
}
```