# We are deploying using Vercel File System API.
# This is basically just a specific file structure in the "output" folder
# Documentation: https://vercel.com/docs/file-system-api


rm -rf .output
yarn build

mkdir .output
mkdir -p .output/static
cp -a dist/client/. .output/static
 
mkdir -p .output/functions/index.func
yarn ncc build vercel/render.js --minify --out .output/functions/index.func
cat > .output/functions/index.func/.vc-config.json << EOF
{
  "runtime": "nodejs14.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "shouldAddHelpers": true
}
EOF

# Step 6: Make render function run on every request (catch all)
cat > .output/config.json << EOF
{
  "version": 3
}
EOF

# Step 7: (Optional) Function configuration
# cat > .output/functions-manifest.json << EOF
# {
#   "version": 1,
#   "pages": {
#     "index.js": {
#       "maxDuration": 10
#     }
#   }
# }
# EOF