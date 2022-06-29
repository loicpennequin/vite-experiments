# We are deploying using Vercel File System API.
# This is basically just a specific file structure in the "output" folder
# Documentation: https://vercel.com/docs/file-system-api


rm -rf .vercel/output
yarn build

mkdir .vercel/output
mkdir -p .vercel/output/static
cp -a dist/client/. .vercel/output/static
 
mkdir -p .vercel/output/functions/index.func
cp dist/client/ssr-manifest.json .vercel/output/functions/index.func/ssr-manifest.json

yarn ncc build scripts/deploy/render.js  --out .vercel/output/functions/index.func

cat > .vercel/output/functions/index.func/package.json << EOF
{
  "type": "module"
}
EOF

cat > .vercel/output/functions/index.func/.vc-config.json << EOF
{
  "runtime": "nodejs14.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "shouldAddHelpers": true
}
EOF

cat > .vercel/output/config.json << EOF
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
EOF

# Step 7: (Optional) Function configuration
# cat > .vercel/output/functions-manifest.json << EOF
# {
#   "version": 1,
#   "pages": {
#     "index.js": {
#       "maxDuration": 10
#     }
#   }
# }
# EOF