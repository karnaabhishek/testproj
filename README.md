# Setup for backend

## Clone the Repo

```bash
git clone https://github.com/savitriya/sfds.git
```

## Moved to current folder

```bash
cd sfds
```

## Pre-commit

```bash
pre-commit install
```

## For Local

Run application using following command

```bash
uvicorn src.main:app --reload --env-file .env
```

## Using Docker

Run application using docker

```bash
docker-compose --env-file .env up --build
```

## Formatting

Run the following command for formatting

```bash
python -m black {source_file_or_directory}
```

## To generate migration file

Run the following:

```bash
alembic revision --autogenerate -m "Message"
```

## For migration of generated file

Run the following:

```bash
alembic upgrade heads
```
# sfds
