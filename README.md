# wfh-ninja

### Methods

GET /quote - Returns list of quote Id by vote count sorted in descending order

GET /quote/<id> - Returns details of quote

POST /quote - Submits a new quote
Accepts application/json

```
{
  "text" : "Sample quote",
  "conditions" : { "key": "value" }
}
```

POST /quote/<quote_id>/vote - Submits a new vote for Quote of id quote_id
Accepts application/json
```
{
  "value": 1
}
```

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
