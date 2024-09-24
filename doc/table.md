# Table API Spec

## Add Table

Endpoint : **``POST``** /api/tables

Request Body:

```json
{
    "name" : "1",
    "status" : 1, // 1 = active, 2 = booked, 3 = inactive
    "open_hr" : "08:00",
    "closed_hr" : "23:00"
}
```

Response Body (Success):

```json
{
    "data" : "Table Created Sucessfully"
}
```

Response Body (Failed):

```json
{
    "errors" : "Table already exist"
}
```

## Get Table

Endpoint : **``GET``** /api/tables

Query Params :
**All Optional
- name: string, find table by table name.
- status: string, find table with status.

```json
{
    "data" : [
        {
            "id" : 1,
            "name" : "1",
            "status" : 1,
            "open_hr" : "08:00",
            "closed_hr" : "23:00"
        },
        {
            "id" : 7,
            "name" : "VIP 3",
            "status" : 2,
            "open_hr" : "08:00",
            "closed_hr" : "23:00"
        }
    ]
}
```

## Update Table

Endpoint : **``PATCH``** /api/tables/:tableId

Headers : 
- Authorization: token

Request Body:
```json
// All is optional
{
    "name" : "VIP 1",
    "status" : 2, // 1 = active, 2 = booked, 3 = inactive
    "open_hr" : "10:00",
    "closed_hr" : "03:00",
}
```

Response Body (Success):

```json
{
    "data" : {
        "id" : 1,
        "name" : "VIP 8",
        "status" : 2, // 1 = active, 2 = booked, 3 = inactive
        "open_hr" : "10:00",
        "closed_hr" : "03:00"
    },

}
```

Response Body (Failed):

```json
{
    "errors" : "Table is not exist"
}
```

## Delete Table

Endpoint : **``DELETE``** /api/table/:id

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
    "errors" : "Table is not exist"
}
```
