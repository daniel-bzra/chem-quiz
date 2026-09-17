#!/usr/bin/env bash
#
# Turns a raw phone recording into the finished clip the quiz expects.
#
#   tools/polish.sh <raw file> <qNN> "<Name>" [start] [duration]
#
#   tools/polish.sh raw/IMG_4471.MOV q01 "Daniel"
#   ROTATE=cw tools/polish.sh raw/IMG_4471.MOV q01 "Daniel" 2.5 40
#   CUTS=12.35-16.20 tools/polish.sh raw/IMG_4471.MOV q12 "Daniel"
#
# start/duration are optional and cut the raw file before anything else:
# start = seconds to skip at the front, duration = seconds to keep.
#
# Environment:
#   ROTATE=cw|ccw|180   turn the picture when the writing is sideways or
#                       upside down (applied after the phone's own rotation)
#   CUTS=a-b[,c-d...]   remove these stretches (seconds on the raw file's own
#                       timeline) and join the rest with a short crossfade.
#                       Put both ends inside a pause, at least 0.2 s from speech.
#   TITLE_CARD=1        prepend a two second title card. Off by default:
#                       18 cards add 36 s, and the brief caps the total at 12 min.
#
# What it always does, identically for every video:
#   - scales to 1280x720 landscape, pads instead of cropping
#   - evens out the loudness so no clip is louder than the next
#   - puts the name in the bottom corner for the whole clip
#   - H.264 / AAC, written straight to videos/<qNN>.mp4
#
set -euo pipefail

# ---------------------------------------------------------------- setup
FFMPEG="${FFMPEG:-ffmpeg}"
FFPROBE="${FFPROBE:-ffprobe}"
command -v "$FFMPEG" >/dev/null 2>&1 || {
  # winget puts it here and does not always reach an already-open shell
  W="$HOME/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
  CAND=$(ls -d "$W"/ffmpeg-*/bin 2>/dev/null | head -1 || true)
  [ -n "$CAND" ] || { echo "ffmpeg not found. Install it with:  winget install --id Gyan.FFmpeg -e"; exit 1; }
  FFMPEG="$CAND/ffmpeg"; FFPROBE="$CAND/ffprobe"
}

RAW="${1:-}"; ID="${2:-}"; WHO="${3:-}"; SS="${4:-}"; DUR="${5:-}"
[ -f "$RAW" ] || { echo "usage: $0 <raw file> <qNN> \"<Name>\" [start] [duration]"; exit 1; }
[ -n "$ID" ]  || { echo "missing question id, e.g. q01"; exit 1; }

case "${ROTATE:-}" in
  "")   ROT="" ;;
  cw)   ROT="transpose=clock," ;;
  ccw)  ROT="transpose=cclock," ;;
  180)  ROT="hflip,vflip," ;;
  *)    echo "ROTATE must be cw, ccw or 180"; exit 1 ;;
esac

CUTS="${CUTS:-}"
[ "$CUTS" = "-" ] && CUTS=""
if [ -n "$CUTS" ] && ! [[ "$CUTS" =~ ^[0-9.]+-[0-9.]+(,[0-9.]+-[0-9.]+)*$ ]]; then
  echo "CUTS must look like 12.3-15.8 or 12.3-15.8,30.1-31.0"; exit 1
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$HERE/videos/$ID.mp4"
FONT_B="C\\:/Windows/Fonts/arialbd.ttf"
FONT_R="C\\:/Windows/Fonts/arial.ttf"
BG="0x0b1020"       # same deep blue as the quiz
FG="0xe8ecf8"
ACCENT="0x5eead4"
XF=0.2              # crossfade length at a cut, in seconds

# drawtext needs colons, quotes and percent signs escaped
esc() { printf '%s' "$1" | sed -e "s/\\\\/\\\\\\\\/g" -e "s/:/\\\\:/g" -e "s/'/\\\\\\\\'/g" -e "s/%/\\\\%/g"; }
W_ESC=$(esc "$WHO")

# ------------------------------------------------------------- checks
HAS_AUDIO=$("$FFPROBE" -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$RAW" | head -1 || true)
[ -n "$HAS_AUDIO" ] || { echo "!! $RAW has no audio track - did the phone record muted?"; exit 1; }

TRIM=()
[ -n "$SS" ]  && TRIM+=(-ss "$SS")
[ -n "$DUR" ] && TRIM+=(-t "$DUR")

mkdir -p "$HERE/videos"

# ------------------------------------------------------ filter pieces
# picture preparation - every piece that gets crossfaded must match exactly
PREP="${ROT}scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=$BG,fps=30,setsar=1,format=yuv420p,settb=AVTB"
LABEL="drawtext=fontfile='$FONT_R':text='$W_ESC':fontcolor=$FG@0.75:fontsize=22:box=1:boxcolor=$BG@0.55:boxborderw=10:x=w-tw-26:y=h-th-26"
LOUD="loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,aformat=channel_layouts=stereo"
ENCODE=(-c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -profile:v high -level 4.0
        -c:a aac -b:a 128k -movflags +faststart)

if [ "${TITLE_CARD:-0}" = "1" ]; then RI=2; else RI=0; fi

# main clip -> [mv] [ma]
if [ -z "$CUTS" ]; then
  MAIN="[$RI:v]$PREP,$LABEL[mv];[$RI:a]$LOUD[ma]"
else
  IFS=',' read -ra RANGES <<< "$CUTS"
  n=${#RANGES[@]}; segs=$((n + 1))
  starts=(0); ends=()
  for r in "${RANGES[@]}"; do ends+=("${r%-*}"); starts+=("${r#*-}"); done
  ends+=("")

  MAIN="[$RI:v]split=$segs$(for ((i=0; i<=n; i++)); do printf '[vi%d]' "$i"; done);"
  MAIN+="[$RI:a]asplit=$segs$(for ((i=0; i<=n; i++)); do printf '[ai%d]' "$i"; done);"
  for ((i=0; i<=n; i++)); do
    if [ -n "${ends[$i]}" ]; then rng="start=${starts[$i]}:end=${ends[$i]}"; else rng="start=${starts[$i]}"; fi
    MAIN+="[vi$i]trim=$rng,setpts=PTS-STARTPTS,$PREP[vs$i];"
    MAIN+="[ai$i]atrim=$rng,asetpts=PTS-STARTPTS[as$i];"
  done
  vp="vs0"; ap="as0"; off=0
  for ((i=1; i<=n; i++)); do
    # the offset of each fade is measured on the already-joined timeline
    off=$(awk -v o="$off" -v a="${starts[$((i-1))]}" -v b="${ends[$((i-1))]}" -v f="$XF" 'BEGIN{printf "%.3f", o + (b - a) - f}')
    MAIN+="[$vp][vs$i]xfade=transition=fade:duration=$XF:offset=$off[vx$i];"
    MAIN+="[$ap][as$i]acrossfade=d=$XF[ax$i];"
    vp="vx$i"; ap="ax$i"
  done
  MAIN+="[$vp]$LABEL[mv];[$ap]$LOUD[ma]"
fi

# --------------------------------------------------------------- run
if [ "${TITLE_CARD:-0}" = "1" ]; then
  TITLES="$HERE/tools/titles.json"
  [ -f "$TITLES" ] || { echo "missing $TITLES"; exit 1; }
  TITLE=$(sed -n "s/^[[:space:]]*\"$ID\"[[:space:]]*:[[:space:]]*\"\(.*\)\",\{0,1\}[[:space:]]*$/\1/p" "$TITLES" | sed 's/",*$//')
  [ -n "$TITLE" ] || { echo "no title for $ID in $TITLES"; exit 1; }
  T_ESC=$(esc "$TITLE"); ID_ESC=$(esc "$(echo "$ID" | tr 'a-z' 'A-Z')")
  CARD=2

  "$FFMPEG" -y -hide_banner -loglevel warning \
    -f lavfi -i "color=c=$BG:s=1280x720:r=30:d=2" \
    -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=48000" \
    "${TRIM[@]}" -i "$RAW" \
    -filter_complex "
      [0:v]drawtext=fontfile='$FONT_B':text='$ID_ESC':fontcolor=$ACCENT:fontsize=34:x=(w-tw)/2:y=h/2-96,
           drawtext=fontfile='$FONT_B':text='$T_ESC':fontcolor=$FG:fontsize=52:x=(w-tw)/2:y=h/2-34,
           drawtext=fontfile='$FONT_R':text='$W_ESC':fontcolor=$FG@0.65:fontsize=30:x=(w-tw)/2:y=h/2+56,
           fade=t=out:st=1.7:d=0.3,setsar=1,format=yuv420p,settb=AVTB[tv];
      $MAIN;
      [tv][1:a][mv][ma]concat=n=2:v=1:a=1[v][a]
    " \
    -map "[v]" -map "[a]" "${ENCODE[@]}" "$OUT"
else
  CARD=0
  "$FFMPEG" -y -hide_banner -loglevel warning \
    "${TRIM[@]}" -i "$RAW" \
    -filter_complex "$MAIN" \
    -map "[mv]" -map "[ma]" "${ENCODE[@]}" "$OUT"
fi

# ------------------------------------------------------------ report
SEC=$("$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$OUT")
MB=$(awk "BEGIN{printf \"%.1f\", $(stat -c%s "$OUT")/1048576}")
printf "  -> videos/%s.mp4   %ss   %s MB" "$ID" "${SEC%.*}" "$MB"
awk -v s="$SEC" -v c="$CARD" 'BEGIN{ s=s-c;
  if (s<30) print "   !! spoken part " int(s) "s - the brief asks for 30-45s";
  else if (s>45.5) print "   !! spoken part " int(s) "s - over the 45s limit";
  else print "   ok" }'
awk -v m="$MB" 'BEGIN{ if (m>10) print "  !! over 10 MB - raise -crf to 27 and run again" }'
