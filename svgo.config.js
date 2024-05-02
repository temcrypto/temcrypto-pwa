module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // disable a default plugin
          removeViewBox: false,
        },
      },
    },
  ],
};
