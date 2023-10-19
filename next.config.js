
const version = require("./package.json").version;
console.log("version", version);

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    version
  },
  eslint: {
    dirs: ['pages', 'src']
  }
}

module.exports = nextConfig;
