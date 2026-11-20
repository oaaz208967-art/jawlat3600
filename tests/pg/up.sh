#!/bin/bash
# تشغيل/إيقاف PostgreSQL محلي للاختبارات:  tests/pg/up.sh start|stop|reset
# يحتاج PostgreSQL 14+ مثبتًا (initdb/pg_ctl/psql). لا علاقة له بـ Supabase الحقيقي.
DIR=${JW_PG_DIR:-/tmp/jw-pg}; PORT=${JW_PG_PORT:-5546}
BIN=$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | tail -1); [ -z "$BIN" ] && BIN=$(dirname "$(which initdb)")
RUN=""; [ "$(id -u)" = 0 ] && RUN="su postgres -s /bin/bash -c"
sh() { if [ -n "$RUN" ]; then $RUN "$1"; else bash -c "$1"; fi; }
HERE=$(cd "$(dirname "$0")" && pwd); SQL="$HERE/../../backend/supabase.sql"
case "$1" in
  stop) sh "$BIN/pg_ctl -D $DIR stop -m fast >/dev/null 2>&1"; exit 0;;
  reset) sh "$BIN/pg_ctl -D $DIR stop -m fast >/dev/null 2>&1"; rm -rf "$DIR";;
esac
if [ ! -d "$DIR/base" ]; then
  mkdir -p "$DIR"; [ -n "$RUN" ] && chown postgres "$DIR"
  sh "$BIN/initdb -D $DIR -A trust -U postgres >/dev/null" || exit 1
fi
sh "$BIN/pg_ctl -D $DIR -o '-p $PORT -k $DIR -c listen_addresses=' -l $DIR/log -w start >/dev/null" || true
P="$BIN/psql -h $DIR -p $PORT -U postgres -q -v ON_ERROR_STOP=1"
sh "$P -d postgres -c 'drop database if exists jw' -c 'create database jw'" || exit 1
cat "$HERE/stub.sql" "$SQL" | sh "$P -d jw -f -" > $DIR/load.log 2>&1 || { cat $DIR/load.log; exit 1; }
echo "ready: $DIR port $PORT db jw"
