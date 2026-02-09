module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // No extra plugins for now – keeps setup simple and avoids missing-module errors
    plugins: [],
  };
};
