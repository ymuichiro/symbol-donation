export const address = "NAU7KANQ25G6KUFQUHQSRIFOGPEIK77FC3W7KXI";
export const currencyId: string = "6BED913FA20223F8";
export const node: string = "https://symbolnode.blockchain-authn.app:3001";

export function unresolvedAddressToEncodedAddress(unresolvedAddress: string): string {
  // hex to bytes
  const bytesArray = [];
  for (var i = 0; i < unresolvedAddress.length; i += 2) {
    bytesArray.push(parseInt(unresolvedAddress.substr(i, 2), 16));
  }
  const uint8Array = new Uint8Array(bytesArray);

  // base32 encode
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

  let bits = 0;
  let value = 0;
  let base32 = "";

  for (var i = 0; i < uint8Array.length; i++) {
    value = (value << 8) | uint8Array[i];
    bits += 8;

    while (bits >= 5) {
      base32 += base32Chars[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }

  if (bits > 0) {
    base32 += base32Chars[(value << (5 - bits)) & 0x1f];
  }

  return base32;
}

export function relToAbs(rel: string): number {
  const divisivility = 6;
  return Math.floor((Number(rel) / Math.pow(10, divisivility)) * 1000) / 1000;
}

export function converter(mosaics: { id: string; amount: string }[]): number {
  const relative = mosaics.filter((e) => e.id === currencyId)[0].amount;
  return relToAbs(relative);
}
