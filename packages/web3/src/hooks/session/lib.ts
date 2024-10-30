import { Buffer } from 'buffer';
import { parse, stringify } from 'superjson';
import { Hex, keccak256 } from 'viem';

export async function keyToHex(key: CryptoKey): Promise<string> {
  const keyString = JSON.stringify({
    key: await crypto.subtle.exportKey('jwk', key),
    format: 'jwk',
  });
  return Buffer.from(keyString).toString('hex');
}

export function hexToKey(key: string): JsonWebKey {
  const keyString = Buffer.from(key, 'hex').toString();
  const object = JSON.parse(keyString);

  return { ...object.key };
}

export async function generateKeyPair() {
  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  return {
    privateKey: await keyToHex(privateKey),
    publicKey: await keyToHex(publicKey),
  };
}

export function split(data: string, size = 214) {
  let copy = data;
  const length = data.length;

  if (length > size) {
    const a: string[] = [];
    const r = length % size;
    const c = (length - r) / size + (r > 0 ? 1 : 0);

    for (let i = 0; i < c; i++) a.push(copy.slice(i * size, i * size + size));

    return a;
  }

  return [data];
}

export async function encrypt(publicKey: string, data: string) {
  const publicKeyObject = await crypto.subtle.importKey(
    'jwk',
    hexToKey(publicKey),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );

  const encryptedData = (
    await Promise.all(
      split(data, 190).map(async (d) =>
        Buffer.from(
          await crypto.subtle.encrypt('RSA-OAEP', publicKeyObject, Buffer.from(d))
        ).toString('base64')
      )
    )
  ).join('-');

  return encryptedData;
}

export async function decrypt(privateKey: string, cipher: string) {
  const privateKeyObject = await crypto.subtle.importKey(
    'jwk',
    hexToKey(privateKey),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['decrypt']
  );

  return (
    await Promise.all(
      cipher
        .split('-')
        .map(async (c) =>
          Buffer.from(
            await crypto.subtle.decrypt('RSA-OAEP', privateKeyObject, Buffer.from(c, 'base64'))
          ).toString('utf-8')
        )
    )
  ).join('');
}

export async function stringifyAndEncrypt(publicKey: string, message: { [key: string]: any }) {
  return await encrypt(publicKey, stringify(message));
}

export async function decryptAndParse<T>(privateKey: string, message: string): Promise<T> {
  return parse(await decrypt(privateKey, message));
}

export const getHashedPassword = (password: string) => {
  return keccak256(('0x' + Buffer.from(password).toString('hex')) as Hex);
};
