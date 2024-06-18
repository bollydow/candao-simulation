const isProd = process.env.NODE_ENV === "production";

module.exports = {
  output: "export", 
  assetPrefix: isProd ? "/candao-simulation/" : "",
  basePath: isProd ? '/candao-simulation' : '',
  trailingSlash: true,
  productionBrowserSourceMaps: false, 
};
