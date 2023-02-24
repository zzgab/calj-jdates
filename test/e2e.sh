project_dir=$(dirname $(realpath "$0"/..))
tmpdir=$(mktemp -d)
cd $tmpdir
npm i $project_dir/calj.net-jdates-$npm_package_version.tgz

status=0

# CJS
cp -r "${project_dir}/test/cjs" $tmpdir/
cd $tmpdir/cjs
result=$(node index.js)
if [[ "$result" == "2023-02-23" ]]; then
  echo "cjs:     PASS"
else
  echo "cjs:     FAIL"
  status=1
fi

# EMS
cp -r "${project_dir}/test/ems" $tmpdir/
cd $tmpdir/ems
result=$(node index.js)
if [[ "$result" == "2023-02-23" ]]; then
  echo "ems:     PASS"
else
  echo "ems:     FAIL"
  status=1
fi

# Browser
rm -rf $tmpdir/node_modules
cp -r "${project_dir}/test/browser" $tmpdir/
cd $tmpdir/browser
cat window.js "${project_dir}/dist/cdn/calj.min.js" index.js > test.js
result=$(node test.js)
if [[ "$result" == "2023-02-23" ]]; then
  echo "browser: PASS"
else
  echo "browser: FAIL"
  status=1
fi

# CLEANUP
rm -rf $tmpdir

exit $status
