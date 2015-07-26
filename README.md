# wfh-ninja

WFH-ninja was originally intended to be a "work from home" excuse generator, allowing the community to vote on the most effective excuses. This repo is built as a generic single page app that displays one quote at a time, with features to "upvote" and "downvote" quotes. User submitted quotes require approval by a registered admin via an admin panel.

Live Demo: http://wfh.ninja/

## Core features
- Post new quote (user submission of quotes)
- Get all approved/ unapproved quotes
- Approve/ reject single quotes via admin panel
- Admin panel (/admin) for admin user registration, login, logout and approving/ rejecting of quotes

## Architecture
WFH-ninja is built with a Python-Flask backend, with a React/ JS/ Bootstrap frontend. WFH-ninja uses a Postgresql database as the datastore.

## Requirements
- Flask
  ```pip install flask```
- SimpleJson
  ```pip install simplejson```
- Flask-CORS
  ```pip install flask-cors```
- Flask-login
  ```pip install flask-login```
- Flask-sqlachemy
  ```pip install flask-sqlalchemy```
- Postgresql
  ```brew install postgresql```
- Psycopg2 (requires postgres)
  ```pip install psycopg2```

## To run
1. Set up Database URL
  ```
  export DATABASE_URL=postgresql://USERNAME:PASSWORD@HOSTURL/DBNAME
  ```
  
  Replace USERNAME, PASSWORD, HOSTURL, DBNAME with your credentials.

2. Set up Database
  ```
  python initdb.py
  ```
3. Run app

  ```
  python main.py
  ```


## Documentation

###Quote object methods###

#### GET /quote (not logged in)
*Returns list of active Quote ids and their details*

Result format:

```
{
   "1": {
    "active": true,
    "conditions": "{}",
    "date_created": "2015-05-17T22:25:59.911361",
    "id": 1,
    "ip": 127.0.0.1,
    "score": 14,
    "text": "Quote 1",
    "view_count": 68
  },
  "10": {
    "active": true,
    "conditions": "{}",
    "date_created": "2015-05-17T23:02:27.596582",
    "id": 10,
    "ip": "127.0.0.1",
    "score": 4,
    "text": "Quote 2",
    "view_count": 13
  }
}
```

#### GET /quote?all=true (requires logged in)
*Returns list of all Quote ids and their details*

Result format:

```
{
   "1": {
    "active": true,
    "conditions": "{}",
    "date_created": "2015-05-17T22:25:59.911361",
    "id": 1,
    "ip": 127.0.0.1,
    "score": 14,
    "text": "Quote 1",
    "view_count": 68
  },
  "13": {
    "active": false,
    "conditions": "{}",
    "date_created": "2015-05-18T23:02:27.596582",
    "id": 13,
    "ip": "127.0.0.1",
    "score": 4,
    "text": "Quote 3",
    "view_count": 15
  }
}
```

#### POST /quote
*Submits a new quote*

Header (application/json):

Name | Type | Description | Required?
--------| -------| --------------------------| ---------
text | String | Body/ Content of Quote  | Required 
conditions | JSON | Additional properties for the quote, e.g. weather conditions, location, etc | Not required 

Example:

```
{
  "text" : "Sample quote",
  "conditions" : { "weather": "sunny" }
}
```

#### GET /quote/`quote_id`
*Returns details of Quote of id `quote_id`*

Result format:
```
{
  "active": false,
  "conditions": "{}",
  "date_created": "2015-05-17T23:51:26.138167",
  "id": 17,
  "ip": "127.0.0.1",
  "text": "quote content",
  "view_count": 2
}
```

#### DELETE /quote/`quote_id` (Requires login)
*Deletes Quote of id `quote_id`*

Result format:
```
{
  "Success": "Quote has been deleted"
}
```

#### PUT /quote/`quote_id`/approve (Requires login)
*Approves Quote of id `quote_id`*

Result format:
```
{
  "active": true,
  "conditions": "{}",
  "date_created": "2015-05-17T23:51:26.138167",
  "id": 17,
  "ip": "127.0.0.1",
  "text": "quote content",
  "view_count": 2
}
```

#### PUT /quote/`quote_id`/reject (Requires login)
*Rejects Quote of id `quote_id`*

Result format:
```
{
  "active": false,
  "conditions": "{}",
  "date_created": "2015-05-17T23:51:26.138167",
  "id": 17,
  "ip": "127.0.0.1",
  "text": "quote content",
  "view_count": 2
}
```

#### POST /quote/`quote_id`/vote
*Submits a new vote for Quote of id `quote_id`*

Header (application/json):

Name | Type | Description | Required?
--------| -------| --------------------------| ---------
value | Integer | 1 for vote up, -1 for vote down  | Required 

Example:
```
{
  "value": 1
}
```

###Admin user object methods###
Admin users can access /admin page to approve, reject and delete quotes. The following methods allow the creation of a new admin user.

#### POST /register
*Creates a new user*

Header (application/json):

Name | Type | Description | Required?
--------| -------| --------------------------| ---------
email | String | Email of registered user  | Required 
password | String | Password of registered user | Required 
secret | String | Secret registration key (in config.py) to allow only specific users to register | Required 

Example:

  ```
  {
    "email": "test@example.com",
    "password": "12345",
    "secret": "secret-registration-key"
  }
  ```

#### POST /login
*Logs a user in*

Header (application/json):

Name | Type | Description | Required?
--------| -------| --------------------------| ---------
email | String | Email of registered user  | Required 
password | String | Password of registered user | Required 

Example:
```
{
  "email": "test@example.com",
  "password": "12345"
}
```

#### GET /logout
*Logs a user out*

Result format:
```
{
  "Success": "User is logged out"
}
```
