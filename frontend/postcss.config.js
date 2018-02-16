// const variables = require('./styles/themes/default/variables/index');

module.exports = ctx => ({
    from: ctx.from || './src/styles/style', // NOTE: you have to set this to make relative @import rules work!
    map: ctx.env === 'development' ? ctx.map : false,
    plugins: {
      'postcss-import': {},
      'postcss-cssnext': {
        // features: {
        //   customProperties: {
        //     variables,
        //   },
        // },
      },
      cssnano: ctx.env === 'production' ? {} : false,
    },
  });