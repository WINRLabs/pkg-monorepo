/* import { encodeFunctionData, Hex, keccak256 } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ProxyAccount } from './proxy-account';
import { erc20Abi } from '../../abis';
import { delay } from '../use-token-allowance';

let sessionPublicKey: string | undefined;
let clientKeyPair: { privateKey: string; publicKey: string } | undefined;
const url = 'https://dev.hubv2.winr.games/rpc';
const network = 'WINR';
const privKey = '0xb04466eb96c7a1da5a313daf530c5df999b2a30c539c5bebbe1e9ed10afa7e3e';
console.log(privKey);
const signer = privateKeyToAccount(privKey);
const serverPublicKey =
  '7b226b6579223a7b226b7479223a22525341222c226e223a2273786d48637336626166685f4d516d4a5a6841715147666a50466e70572d3670536f5a43424b4765736277746145475074654841614f4e30634273703346624b576172566d747545575a547362637846504273776b55736f6141355f6a53492d6352514c34464d6331314941385745724e69786a68646e68655475746f684b576e4c574a617766593965694231456f72495a784c6679514b32435359685539767738306c77486236736b4d44505a336f554e53434f76434264765a726b463568696b736a6f2d716d6f532d76554f415a5a537243734b504651566656526b362d6a436f6161704845726e635749636953706978345f704c42433041426268617a414e7759335844503065677a7455374c555a7a332d634e7a6f59637248335f736a5669724553695637312d48764947426459502d70766c426256644b4c56422d5071324f6c33354d41416b3148536575486732447a51222c2265223a2241514142227d2c22666f726d6174223a226a776b227d';
const password = keccak256(('0x' + Buffer.from('123456').toString('hex')) as Hex);

async function register() {
  try {
    const account = new ProxyAccount({
      url,
      signer,
      network,
      serverPublicKey,
      password,
    });

    const auth = await account.login();

    if (auth.clientKeyPair) {
      sessionPublicKey = auth.sessionPublicKey;
      clientKeyPair = auth.clientKeyPair;
    }

    console.log(await account.getAddress());
  } catch (error) {
    console.log('Register', error);
    sessionPublicKey = undefined;
    clientKeyPair = undefined;
  }
}

async function call() {
  if (!sessionPublicKey && !clientKeyPair) {
    throw new Error('Cant access');
  }

  const account = new ProxyAccount({
    url,
    signer,
    network,
    serverPublicKey,
    password,
    sessionPublicKey,
    clientKeyPair,
  });

  let success = 0;
  let fail = 0;
  await delay(10000);

  while (success < 2) {
    const now = Date.now();
    await account
      .sendTransaction({
        dest: '0x52974b73b10a595FAb141B9806fe61cDa8649468',
        value: '0',
        data: encodeFunctionData({
          abi: erc20Abi,
          args: [signer.address, 100000000000000n],
          functionName: 'mint',
        }),
      })
      .then(() => {
        console.log('Duration', Date.now() - now);
        success++;
      })
      .catch((err) => {
        success++;
        console.log(err);
      });
  }
  await delay(10000);
  console.log(await account.getAddress());
  await delay(20000);
  const response = await account.unauthorize();
  console.log('Unauthorize', response.status);
  console.log('Rates', { success, fail });
}

export const unlitimited = () => {
  register()
    .then(() =>
      call()
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          // unlitimited();
          console.log(error);
        })
    )
    .catch((error) => {
      // unlitimited();
      console.log(error);
    });
};

// unlitimited();
// register().then(() => call());
 */
