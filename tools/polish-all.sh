#!/usr/bin/env bash
#
# Runs tools/polish.sh for every line in tools/takes.tsv.
#
#   tools/polish-all.sh            everything
#   tools/polish-all.sh q09 q16    only these questions
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAWDIR="$HERE/videos/raw"
ONLY=" $* "
done_n=0; fail_n=0

while IFS=$'\t' read -r file id who rot cuts || [ -n "${file:-}" ]; do
  case "$file" in ""|\#*) continue ;; esac
  [ "$ONLY" = "  " ] || [[ "$ONLY" == *" $id "* ]] || continue

  src="$RAWDIR/$file"
  if [ ! -f "$src" ]; then
    echo "!! $id: raw file not found: $file"; fail_n=$((fail_n+1)); continue
  fi
  [ "$rot" = "-" ] && rot=""

  printf "%s  %-8s %-4s %-12s" "$id" "$who" "${rot:--}" "${cuts:--}"
  if ROTATE="$rot" CUTS="${cuts:-}" "$HERE/tools/polish.sh" "$src" "$id" "$who"; then
    done_n=$((done_n+1))
  else
    echo "   !! failed"; fail_n=$((fail_n+1))
  fi
done < "$HERE/tools/takes.tsv"

echo
echo "$done_n done, $fail_n failed"
[ "$fail_n" -eq 0 ]
