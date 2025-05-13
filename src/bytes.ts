import { BTHomeData, btHomeBytes, VarName, Unit } from "./util";

export function parsePacket(
  initialBits: string,
  receivedBytes: number[],
  hasEncryption: boolean
) {
  const btHomeData: BTHomeData[] = [];
  // currently package only supports bytes without encryption key
  if (!hasEncryption) {
    let filteredBytes;
    // reverse and find bit character
    const bitNum = [...initialBits].reverse().join("").charAt(1);
    const macAddressRemovedBytes = [...receivedBytes];
    if (bitNum === "0") {
      macAddressRemovedBytes.splice(0, 1);
      filteredBytes = macAddressRemovedBytes;
    } else if (bitNum === "1") {
      let macAddress = "";
      for (let j = 1; j < 7; j++) {
        const hexValue = receivedBytes[j].toString(16).padStart(2, "0");
        macAddress = hexValue.toUpperCase() + macAddress;
      }
      if (macAddress) {
        btHomeData.push({
          varName: VarName.macAddress,
          value: macAddress,
          extension: Unit.macAddress,
        });
      }
      macAddressRemovedBytes.splice(0, 7);
      filteredBytes = macAddressRemovedBytes;
    }

    if (filteredBytes) {
      const bytes = [...filteredBytes];
      for (let i = 0; i < filteredBytes.length; i++) {
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
              const dataValue = value * filteredBtHomeBytes.factor;
              btHomeData.push({
                varName: filteredBtHomeBytes.varName,
                value: filteredBtHomeBytes.fixedPoint
                  ? Number(dataValue.toFixed(filteredBtHomeBytes.fixedPoint))
                  : dataValue,
                extension: filteredBtHomeBytes.unit,
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
