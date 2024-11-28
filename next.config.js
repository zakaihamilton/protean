
const version = require("./package.json").version;
console.log("version", version);

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    version
  },
  eslint: {
    dirs: ['pages', 'src']
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"]
  }
}

module.exports = nextConfig;
