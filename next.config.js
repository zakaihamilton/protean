const version = require("./package.json").version;
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"]
  }
}

module.exports = nextConfig;