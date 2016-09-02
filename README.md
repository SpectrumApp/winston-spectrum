A [winston][0] transport for [SpectrumApp][1]

## Installation

``` sh
$ npm install winston
$ npm install winston-spectrum
```

## Usage

``` js
var winston = require('winston');

/*
 * Requiring `winston-spectrum` will expose
 * `winston.transports.Spectrum`
 */
require('winston-spectrum');

winston.add(winston.transports.Spectrum, options);
```

Options are the following:

* __url:__ The URL of a Spectrum REST stream. (default: 'http://localhost:9000')
* __level:__ Level of messages that this transport should log.

When logging, you can use the `sublevel` metadata property to direct the log to
the correct sublevel:

``` js

winston.log('warn', logMessage, {sublevel: 'my sublevel'});

```

## License

This software is release under the MIT License.

[0]: https://github.com/winstonjs/winston
[1]: https://www.devspectrum.com/
