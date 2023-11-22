# AlgoRace / Remote Compile Manager Service

## Overview

This compile manager orchestrates remote compilation for AlgoRace, a multiplayer algorthim and data structure coding platform, but is free to use by anyone.

## How it works

When the manager recieves a POST at /compile with the information listed below, it creates a job. A jobId is then returned to the client with an initial status of 
'pending'. The job is added to a queue which has a worker service listening (See github.com/justinbather/remote-compiler for more info). The worker builds
the file structure with the posted code and tests for a docker container to execute. Once compiled, the worker sends a PATCH to /compile/:jobId to update the 
job with a status of 'success' or 'failed' along with the stdout/stderr of the execution. The client, with the jobId, can GET /job-status/:jobId to get the status
and output of the code sent.

## Endpoints

### Compile code
```http
POST /compile
```
Example request:
```json
{
  "code": "console.log('hello world')",
  "problem": "ObjectId(12234567)"
}

```

Example response:
```http
201 CREATED
```
```json
{
  "jobId": "123445567",
  "status": "pending"
}
```

### Get compilation update
```http
GET /job-status/:jobId
```

Example request:
```http
GET /job-status/123445567
```

Example response:

```http
200 OK
```
```json
{
  "jobId": "123445567",
  "status": "success",
  "output": "hello world",
  "success": "true"
}
```

