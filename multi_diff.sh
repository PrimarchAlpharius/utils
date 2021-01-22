#!/usr/bin/bash
typeset -r diffs=diffs.txt
typeset -a allfiles=()
typeset -- filename=''

# fills the allfiles array with all *.txt files except the diffs.txt
# that can be found from the current directory and down all sub-directories
while IFS= read -r -d '' filename; do
  allfiles+=("$filename")
done < <(
  find . -type f -name '*.txt' -and -not -name "$diffs" -print0 2>/dev/null
)

[[ ${#allfiles[@]} -lt 2 ]] && exit 2 # Need at least 2 files to compare

typeset -i i=0 j=0
typeset -- file_a='' file_b=''
export LC_MESSAGES=POSIX
# for all files except last
for ((i = 0; i < ${#allfiles[@]} - 1; i++)); do
  file_a="${allfiles[$i]}"
  # for next file to last file
  for ((j = i + 1; j < ${#allfiles[@]}; j++)); do
    file_b="${allfiles[$j]}"
    diff --suppress-blank-empty --unified=0 --minimal -- \
      "$file_a" "$file_b" 2>/dev/null
    echo
  done
done >"$diffs" # all output to the diffs file

