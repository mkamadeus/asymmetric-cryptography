import { elGamalDecrypt, elGamalEncrypt, elGamalGenerateKey } from "./elgamal";
import {
  paillierDecrypt,
  paillierEncrypt,
  paillierGenerateKey,
} from "./paillier";
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
  paillier: {
    keygen: paillierGenerateKey,
    encrypt: paillierEncrypt,
    decrypt: paillierDecrypt,
  },
};
