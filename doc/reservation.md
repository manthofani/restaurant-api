# Reservation API Spec

## Add Reservation

Endpoint : **``POST``** /api/reservation

Request Body:

```json
{
    "username" : "tegar",
    "id_table" : 1,
    "reserved_time" : "21:00",
    "email" : "tegar@customer.com"
}
```

Response Body (Success):

```json
{
    "data" : {
        "receipt" : "10121", // generated_id
        "status" : 1, // 1 = active, 2 = booked, 3 = closed.
        "id_table" : 1,
        "reserved_time" : "21:00",
        "name" : "tegar",
        "email" : "tegar@customer.com",
    }
}
```

Response Body (Failed):

```json
{
    "errors" : "Table is inactive"
}
```

## Get Reservation

Endpoint : **``GET``** /api/reservation

Query Params :
**All fields are Optional
- receipt: int, find reservation by receipt number.
- reserved_time: string, find reservation based on time.
- username: string, find reservation by username.
- status: string, find table with status.
- id_table : int, find table by id_table.

```json
{
    "data" : [
        {
            "receipt" : "10121",
            "status" : 1, // 1 = active, 2 = booked, 3 = done.
            "id_table" : 1,
            "reserved_time" : "21:00",
            "name" : "Tegar",
            "email" : "tegar@customer.com",
        },
        {
            "receipt" : "10122", 
            "status" : 1,
            "id_table" : 2,
            "reserved_time" : "22:00",
            "name" : "Tegar woo",
            "email" : "tegar@customer.com",
        }
    ]
}
```

## Update/Cancel Reservation

Endpoint : **``PATCH``** /api/reservation/:id

Headers : 
- Authorization: token

Request Body:
```json
{
    "status" : 2, // mandatory - 1 = active, 2 = booked, 3 = done
}
```

Response Body (Success):

```json
{
    "data" : {
        "receipt" : "10121",
        "status" : 2, // 1 = active, 2 = booked, 3 = done
        "id_table" : 2,
        "reserved_time" : "21:00",
        "name" : "Tegar",
        "email" : "tegar@customer.com",
    },

}
```

Response Body (Failed):

```json
{
    "errors" : "You're not able to cancel this booking due to cancellation policy"
}
```

