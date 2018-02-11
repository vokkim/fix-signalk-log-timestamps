# Signal K log timestamp fix

Parse [Signal K](https://github.com/SignalK/signalk-server-node) multiplexed logs 
for `GPRMC` NMEA 0183 sentences and fix file timestamps accordingly.

Will output fixed logs to new files `fixed-${yyyy}-${mm}-${dd}T{hh}:${MM}:${ss}.log`

### Usage

    node index.js <files>

### Example

    node index.js signalk-rawdata.log.2017-07-*

## License

MIT