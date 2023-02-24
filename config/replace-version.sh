grep -Rl '@VERSION@' dist \
  | xargs sed -i '' 's#@VERSION@#'$1'#g'
