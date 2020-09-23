#!/bin/sh
cd $(dirname $0)
(echo "begin;"; cat *.sql; echo "commit;") | psql -d space
