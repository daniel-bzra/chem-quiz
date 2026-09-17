#!/usr/bin/env bash
#
# Runs tools/polish.sh for every line in tools/takes.tsv.
#
#   tools/polish-all.sh            everything
#   tools/polish-all.sh q09 q16    only these questions
#
# All clips are played SPEED times faster (default 1.06) so the 18 videos stay
# inside the 12 minutes the brief allows. A line can override it in its own
# speed column.
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAWDIR="$HERE/videos/raw"
SPEED_ALL="${SPEED:-1.06}"
ONLY=" $* "
done_n=0; fail_n=0

while IFS=$'\t' read -r file id who rot cuts keep speed || [ -n "${file:-}" ]; do
  case "$file" in ""|\#*) continue ;; esac
  [ "$ONLY" = "  " ] || [[ "$ONLY" == *" $id "* ]] || continue

  src="$RAWDIR/$file"
  if [ ! -f "$src" ]; then
    echo "!! $id: raw file not found: $file"; fail_n=$((fail_n+1)); continue
  fi
  [ "${rot:-}" = "-" ] && rot=""
  [ "${cuts:-}" = "-" ] && cuts=""
  [ "${keep:-}" = "-" ] && keep=""
  [ -z "${speed:-}" ] || [ "$speed" = "-" ] && speed="$SPEED_ALL"

  printf "%s  %-8s %-4s %-6s x%-5s" "$id" "$who" "${rot:--}" "${keep:--}" "$speed"
  if ROTATE="$rot" CUTS="${cuts:-}" SPEED="$speed" "$HERE/tools/polish.sh" "$src" "$id" "$who" "" "${keep:-}"; then
    done_n=$((done_n+1))
  else
    echo "   !! failed"; fail_n=$((fail_n+1))
  fi
done < "$HERE/tools/takes.tsv"

echo
echo "$done_n done, $fail_n failed"
[ "$fail_n" -eq 0 ]
