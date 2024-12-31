export default function base64ToUint8Array(base64: string): Uint8Array {
  const decodedString = atob(base64);
  const arrayBuffer = new Uint8Array(decodedString.length);

  for (let i = 0; i < decodedString.length; i++) {
    arrayBuffer[i] = decodedString.charCodeAt(i);
  }

  return arrayBuffer;
}