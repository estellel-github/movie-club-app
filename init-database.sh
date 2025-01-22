#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'movieclub_test_db') THEN
            CREATE DATABASE movieclub_test_db;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'movieclub_dev_db') THEN
            CREATE DATABASE movieclub_dev_db;
        END IF;
    END
    \$\$;
EOSQL
