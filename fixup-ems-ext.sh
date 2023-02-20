grep -Rl 'from "./' dist/lib/esm | xargs sed -i -e '/from "\.\// s#from "./\(.*\)";#from "./\1.js";#'
