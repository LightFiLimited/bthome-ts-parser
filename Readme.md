## Bthome ts parser

bthome-ts-parser is a typescript library dealing with bthome packets

- Library to parse bthome format packets and returns data value with BTHOME version
- Currently only supports BTHOME Version 2 without encryption
- Accepts data formats from official [BTHOME site](https://bthome.io/format/)
- Available tests from [BTHOME_Test_parser](https://github.com/Bluetooth-Devices/bthome-ble/blob/V2/tests/test_parser_v2.py)
- [Github Repo](https://github.com/LightFiLimited/bthome-ts-parser)

### Example Usage

```typescript
import { getByteProperties } from "lf-bthome-bytes";

const tempHumByte = [64, 2, 202, 9, 3, 191, 19];
console.log(getByteProperties(tempHumByte));

// expected output:
[
  { extension: "°C", value: "25.1", varName: "temperatureC" },
  { extension: "%", value: 50.55, varName: "relativeHumidity" },
];
```
