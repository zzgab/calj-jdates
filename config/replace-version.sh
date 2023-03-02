project_dir=$(dirname $(dirname $(realpath "$0")))

grep -Rl '@VERSION@' "${project_dir}/dist" \
  | xargs sed -i'.bak' -e 's#@VERSION@#'$1'#g'

find "${project_dir}/dist" -name "*.bak" -delete
