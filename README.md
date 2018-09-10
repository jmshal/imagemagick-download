# @jmshal/imagemagick-download

This package was created to make it easy to setup and use ImageMagick on an Azure Function App.

This isn't intended to be used in production - it has it's quirks.

## Example usage

```js
const { download } = require('@jmshal/imagemagick-download');

const { convert, identify } = await download({
  platform: 'windows',
  arch: 'x64',
  version: '7.0.8-11',
});

console.log(convert); // C:\\example\\node_modules\\@jmshal\\imagemagick-download\\bin\\windows\\x64\\7.0.8-11\\convert.exe
```

```sh
$ ./node_modules/.bin/imagemagick-download --version 7.0.8-11
```

## Options

Name | Description | Options
--- | --- | ---
platform | The platform the download should target. | `windows`
arch | The CPU architecture the download should target. | `x64` `x86`
version | The version of ImageMagick to download. | eg. `7.0.8-11`
mirror | The download mirror. | eg. `https://imagemagick.org/download/`

## License

This package is licensed under the [MIT license](./LICENSE.txt).

The ImageMagick software is owned by ImageMagick Studio LLC. I have no affiliation with ImageMagick Studio LLC.

The ImageMagick software itself is distributed under the [Apache 2.0 license](https://imagemagick.org/script/license.php).
