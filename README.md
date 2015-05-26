# wfh-ninja

### Methods

**User methods**

POST /register - Registers a new user
```
{
  "email": "test@example.com",
  "password": "12345",
  "secret": "secret-registration-key"
}
```

POST /login - Logs a user in
```
{
  "email": "test@example.com",
  "password": "12345"
}
```

GET /logout - Logs a user out

**Quote methods**

GET /quote - Returns list of quote Id by vote count sorted in descending order

POST /quote - Submits a new quote
Accepts application/json

```
{
  "text" : "Sample quote",
  "conditions" : { "key": "value" }
}
```

GET /quote/unapproved - Returns list of unapproved quotes
* requires login

GET /quote/[quote_id] - Returns details of quote of id quote_id

PUT /quote/[quote_id]/approve - Approves quote of id quote_id
* requires login

POST /quote/[quote_id]/vote - Submits a new vote for Quote of id quote_id
```
{
  "value": 1
}
```

### Install requirements
```pip install Flask```

```pip install flask-cors```

```pip install flask-login```

```pip install flask-sqlalchemy```

### To run
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
