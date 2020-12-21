# api.you.dev

This repository contains all the necessary files to get an instance of the You.Dev API up and running.



## Description

You.Dev's API is a [Node.JS](https://nodejs.org/)/[Express](https://expressjs.com/) application backed by a [MySQL](https://dev.mysql.com/) database.



## Requirements

### Running You.Dev locally requires:

- Internet access
- Access to [GitHub](https://github.com/)
- [Git](https://git-scm.com/) installed (optional, source also available as .zip)

### If running directly on host:

- [NodeJS](https://nodejs.org/) installed and (`node`,`npm`,`npx`) accessible in your shell's `$PATH`
- Access to [npm public package repository](https://www.npmjs.com/)
- An existing MySQL database with credentials 


### If running locally in Docker:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- access to [Docker Hub](https://hub.docker.com/)



## Getting Started

Get the source by either downloading a [.zip file]() or by cloning the repository using Git

```bash
git clone https://github.com/you-dot-dev/api.you.dev.git
```

### Docker Compose

To run You.Dev locally, simple execute the following command while in the repository root.

```bash
docker-compose up
```

### Docker Image

If you would like to run You.Dev locally but need to point at an existing or remote database, first build a Docker image

```bash
docker build . \
  -t api.you.dev:latest \
  -t api.you.dev:0.1.0 \
  -t api.you.dev:0.1
```


### Directly on host

To run You.Dev's API directly on host, first install NodeJS dependencies. While in the repository root, run the command:

```bash
npm install
```


