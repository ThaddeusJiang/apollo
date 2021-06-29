jobDefinition

```json
{
    "id": "1",
    "host": "http://localhost:5001",
    "name": "test jobDefinition",
    "on": ["crontab", "* 11 * * *"],
    "run": {
        "api": "/addMessage?text=createByJob",
        "method": "GET",
        "body": ""
    },
    "active": true
}
```

job

```json
{
    "id": "1",
    "job_definition": {
        "id": "1",
        "host": "http://localhost:5001",
        "name": "test jobDefinition",
        "on": [
            "crontab",
            "* 11 * * *"
        ],
        "run": {
            "api": "/addMessage?text=createByJob",
            "method": "GET",
            "body": ""
        },
        "active": false
    },
    "startAt": "",
    "endAt": "",
    "status": "pass",
    "message": ""
}
```