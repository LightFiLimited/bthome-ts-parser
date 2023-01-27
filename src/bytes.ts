import { BTHomeData, btHomeBytes, DataType } from "./util";

export function parsePacket(receivedBytes: number[], encryptionKey?: string) {
  const bytes = [...receivedBytes];
  const btHomeData: BTHomeData[] = [];
  for (let i = 0; i < receivedBytes.length; i++) {
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
  return btHomeData;
}
