# Advanced Docker Deploy of ScriptedForms

This docker deploy is currently incomplete. It aims to be provide a full
installation of ScriptedForms, served in a multi user format via JupyterHub
behined nginx.

It is planned that this docker build will become the focus for advanced use
cases of ScriptedForms. The idea is it will provide the ability to save form
results to the PostgreSQL database associating that data entered with the
user login from JupyterHub. Data should then be trendable. Plan to also
implement an easy to customise navigation panel.

This docker installation will become the location where documentation and
examples are written and provided to the user in an interactive format. This
documentation + examples will also be the focus of the selenium tests.

If you want to run this on a computer that has a public IP then you should
(as in MUST) **secure it with ssl** by adding ssl options to the docker
configuration for nginx.

## Usage

### Prep

You will need docker and docker-compose:

* [Docker](https://docs.docker.com/install/)
* docker-compose -- `pip install docker-compose`

For Linux you will need to set up docker to be able to managed as a non-root
user:

> <https://docs.docker.com/install/linux/linux-postinstall/>

### Building

Building is as simple as running the following in this directory

```bash
docker-compose build
```

### Running

To start the server call the following in this directory:

```bash
docker-compose up
```

To run as a daemon that will automatically boot when your computer turns on
run the following:

```bash
docker-compose up -d
```

You will be able to access the server by typing `localhost` within a browser.

### Shutdown the server

To shutdown the server run:

```bash
docker-compose stop
```

### Delete all docker data

If for some reason you need it, the following command will delete all docker
data from all docker projects (WARNING, IRREVERSABLE):

```bash
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && echo 'y' | docker volume prune
```