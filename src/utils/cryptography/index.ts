import { elGamalDecrypt, elGamalEncrypt, elGamalGenerateKey } from "./elgamal";
import { rsaDecrypt, rsaEncrypt, rsaGenerateKey } from "./rsa";

export default {
  rsa: {
    keygen: rsaGenerateKey,
    encrypt: rsaEncrypt,
    decrypt: rsaDecrypt,
  },
  elgamal: {
    keygen: elGamalGenerateKey,
    encrypt: elGamalEncrypt,
    decrypt: elGamalDecrypt,
  },
};
