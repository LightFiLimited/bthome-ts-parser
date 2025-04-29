import { getByteProperties } from "./index";
import { BTHomeVersion } from "./util";

test("parses temp, hum and battery bytes", () => {
  const dataString = "\x40\x01\x5d\x02\x5d\x09\x03\xb7\x18";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "%", value: 93, varName: "battery" },
    { extension: "°C", value: "24.0", varName: "temperatureC" },
    { extension: "%", value: 63.27, varName: "relativeHumidity" },
  ];
  expect(getByteProperties(byteArray).data).toStrictEqual(expectedData);
  expect(getByteProperties(byteArray).version).toStrictEqual(BTHomeVersion.v2);
});

test("Test that we only process version 2 data", () => {
  const dataString = "\xE1\x02\x00\x0c\x04\x04\x13\x8a\x01";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  expect(getByteProperties(byteArray).data).toHaveLength(0);
});

test("Test BTHome parser with wrong encryption key.", () => {
  const dataString =
    "\x41\xd2\xfc\xef\xe5\x2e\xb2\x12\xd6\x00\x11\x22\x33\xbc\x38\xc9\x66";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  expect(getByteProperties(byteArray).data).toHaveLength(0);
});

test("Test BTHome parser for a non-existing Object ID xFE.", () => {
  const dataString = "\x40\xFE\xca\x09";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  expect(getByteProperties(byteArray).data).toHaveLength(0);
});

//  Should only return the battery reading, as humidity is after wrong object id.
test("Test BTHome parser for battery, wrong object id and humidity reading", () => {
  const dataString = "\x40\x01\x5d\xfe\x5d\x09\x03\xb7\x18";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "%", value: 93, varName: "battery" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for temperature humidity reading without encryption.", () => {
  const dataString = "\x40\x02\xca\x09\x03\xbf\x13";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "°C", value: "25.1", varName: "temperatureC" },
    { extension: "%", value: 50.550000000000004, varName: "relativeHumidity" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for temperature humidity battery reading", () => {
  const dataString = "\x40\x01\x5d\x02\x5d\x09\x03\xb7\x18";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "%", value: 93, varName: "battery" },
    { extension: "°C", value: "24.0", varName: "temperatureC" },
    { extension: "%", value: 63.27, varName: "relativeHumidity" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for pressure reading without encryption.", () => {
  const dataString = "\x40\x04\x13\x8a\x01";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "hPa", value: 356.03000000000003, varName: "pressure" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for illuminance reading without encryption", () => {
  const dataString = "\x40\x05\x13\x8a\x14";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "lux", value: 404.67, varName: "illuminance" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for mass reading in kilograms without encryption.", () => {
  const dataString = "\x40\x06\x5E\x1F";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "kg", value: 80.3, varName: "massKG" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for mass reading in pounds without encryption.", () => {
  const dataString = "\x40\x07\x3E\x1d";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "lux", value: 74.86, varName: "massLB" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for dew point reading without encryption.", () => {
  const dataString = "\x40\x08\xCA\x06";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "°C", value: 17.38, varName: "dewpoint" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for counter reading without encryption.", () => {
  const dataString = "\x40\x09\x60";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "", value: 96, varName: "count" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for energy reading without encryption.", () => {
  const dataString = "\x40\x0a\x13\x8a\x14";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "kWh", value: "40.467", varName: "energyInkWh" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for energy reading without encryption.", () => {
  const dataString = "\x40\x0b\x02\x1b\x00";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "W", value: 69.14, varName: "power" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BThome parser for voltage reading without encryption.", () => {
  const dataString = "\x40\x0c\x02\x0c";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "V", value: 3.074, varName: "voltage" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for PM2.5 and PM10 reading without encryption.", () => {
  const dataString = "\x40\x0d\x12\x0c\x0e\x02\x1c";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "ug/m3", value: 3090, varName: "particulateMatter" },
    { extension: "ug/m3", value: 7170, varName: "pm10" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for CO2 reading without encryption.", () => {
  const dataString = "\x40\x12\xe2\x04";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "ppm", value: 1250, varName: "CO2ppm" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for VOC reading without encryption.", () => {
  const dataString = "\x40\x133\x01";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [{ extension: "ug/m3", value: 307, varName: "tvoc" }];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for moisture reading from b-parasite sensor.", () => {
  const dataString = "\x40\x14\x02\x0c";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "%", value: 30.740000000000002, varName: "moisture" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for double temperature reading without encryption.", () => {
  const dataString = "\x40\x02\xca\x09\x02\xcf\x09";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "°C", value: "25.1", varName: "temperatureC" },
    { extension: "°C", value: "25.1", varName: "temperatureC" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});

test("Test BTHome parser for triple temperature, double humidity and single battery reading without encryption.", () => {
  const dataString =
    "\x40\x02\xca\x09\x02\xcf\x09\x02\xcf\x08\x03\xb7\x18\x03\xb7\x17\x01\x5d";
  const byteArray = Array.from(dataString).map((char) => char.charCodeAt(0));
  const expectedData = [
    { extension: "°C", value: "25.1", varName: "temperatureC" },
    { extension: "°C", value: "25.1", varName: "temperatureC" },
    { extension: "°C", value: "22.6", varName: "temperatureC" },
    { extension: "%", value: 63.27, varName: "relativeHumidity" },
    { extension: "%", value: 60.71, varName: "relativeHumidity" },
    { extension: "%", value: 93, varName: "battery" },
  ];
  expect(getByteProperties(byteArray).data).toEqual(expectedData);
});
