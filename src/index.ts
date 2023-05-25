import { parsePacket } from "./bytes";
import { BTHomePacket } from "./util";

const BT_Version = "v2";

// const testByte = [1, 100, 2, 193, 7, 3, 254, 14, 18, 221, 1];
const testByte = [1, 100, 2, 52, 7, 46, 63, 18, 112, 5];
const macTestByte = [
  66, 128, 132, 112, 11, 218, 215, 1, 100, 2, 53, 8, 46, 63, 18, 250, 7,
];

// console.log("Packet is", parsePacket(macTestByte, ""));

export function getByteProperties(
  receivedBytes: number[],
  encryptionKey?: string
) {
  const btHomePacket: BTHomePacket = {
    version: BT_Version,
    encryption: encryptionKey ? true : false,
    data: parsePacket(receivedBytes, encryptionKey),
  };
  return btHomePacket;
}
