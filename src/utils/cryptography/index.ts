import { rsaDecrypt, rsaEncrypt, rsaGenerateKey } from "./rsa";

export default {
  rsa: {
    keygen: rsaGenerateKey,
    encrypt: rsaEncrypt,
    decrypt: rsaDecrypt,
  },
};
