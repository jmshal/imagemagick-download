const {bin} = require('./');

bin({ platform: 'windows', version: '7.0.8-11' }).then(({convert}) => {
  console.log(convert);
});
