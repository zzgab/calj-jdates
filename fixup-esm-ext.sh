
# https://bobbyhadz.com/blog/javascript-error-err-module-not-found-cannot-find-module
#
# When used in ESM in Node (import instead of require),
# a local import inside the library
#   ie: import { JDate } from "./JDate"
# won't work: it needs the explicit extension ("./JDate.js").
# This command is here to fix the files after build and before publish.
grep -Rl 'from "./' dist/lib/esm \
  | xargs sed -i '' '/from "\.\// s#from "./\(.*\)";#from "./\1.js";#'
