project_dir=$(dirname $(dirname $(realpath "$0")))

grep -Rl '@VERSION@' "${project_dir}/dist" \
  | xargs sed -i'' -e 's#@VERSION@#'$1'#g'
