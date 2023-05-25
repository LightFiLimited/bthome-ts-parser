import { BTHomeData, btHomeBytes, DataType, MetricNames, Unit } from "./util";

export function parsePacket(receivedBytes: number[], encryptionKey?: string) {
  const btHomeData: BTHomeData[] = [];
  // currently package only supports bytes without encryption key
  if (!encryptionKey) {
    const binaryMacInfo = (receivedBytes[0] >>> 0).toString(2);
    // reverse and find bit character
    const bitNum = [...binaryMacInfo].reverse().join("").charAt(1);
    const macAddressRemovedBytes = [...receivedBytes];
    if (bitNum === "0") {
      macAddressRemovedBytes.splice(0, 1);
    } else if (bitNum === "1") {
      let macAddress = "";
      for (let j = 1; j < 7; j++) {
        const hexValue = receivedBytes[j].toString(16).padStart(2, "0");
        macAddress = macAddress + hexValue.toUpperCase();
      }
      if (macAddress) {
        btHomeData.push({
          type: MetricNames.macAddress,
          value: macAddress,
          unit: Unit.macAddress,
        });
      }
      macAddressRemovedBytes.splice(0, 7);
    }

    if (macAddressRemovedBytes) {
      const bytes = [...macAddressRemovedBytes];
      for (let i = 0; i < macAddressRemovedBytes.length; i++) {
        if (bytes.length > 0) {
          const byteId = bytes[0];
          const filteredBtHomeBytes = btHomeBytes.find(
            (byte) => byte.byteId === byteId
          );
          if (filteredBtHomeBytes) {
            let value: number | undefined;
            // if (filteredBtHomeBytes.dataType === DataType.uint) {
            for (let i = 1; i <= filteredBtHomeBytes.byteLength; i++) {
              if (value === undefined) value = bytes[i];
              else value = value + bytes[i] * 256;
              //   }
            }
            if (value !== undefined) {
              btHomeData.push({
                type: filteredBtHomeBytes.metricType,
                value: value * filteredBtHomeBytes.factor,
                unit: filteredBtHomeBytes.unit,
              });
            }
            bytes.splice(0, filteredBtHomeBytes.byteLength + 1);
          }
        }
      }
    }
  }
  return btHomeData;
}
