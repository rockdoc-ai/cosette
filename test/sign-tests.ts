import * as cose from '../lib/index';
import test from 'ava';
import { bufferEqual, readSigningTestData } from './util'

const TEST_NAMES = [
  { name: 'sign-tests/ecdsa-01' },
  { name: 'sign-tests/sign-pass-01' },
  { name: 'sign-tests/sign-pass-02' },
  { name: 'sign-tests/sign-pass-03' },
  { name: 'sign1-tests/sign-pass-01' },
  { name: 'sign1-tests/sign-pass-02' },
  { name: 'sign1-tests/sign-pass-03', verifyOptions: { defaultType: cose.sign.Sign1Tag } },
];
for (const { name, verifyOptions } of TEST_NAMES) {
  test(`create ${name}`, async (t) => {
    const { verifier, plaintext, headers, signers } = await readSigningTestData(`test/Examples/${name}.json`);
    const buf = await cose.sign.create(headers, plaintext, signers);
    const decoded = await cose.sign.verify(buf, verifier);
    t.deepEqual(decoded, plaintext);
  });

  test(`verify ${name}`, async (t) => {
    const { verifier, signature, plaintext } = await readSigningTestData(`test/Examples/${name}.json`);
    const buf = await cose.sign.verify(signature, verifier, verifyOptions);
    bufferEqual(t, buf, plaintext);
  });
}


[
  { name: 'sign-tests/sign-fail-01', message: /Unexpected cbor tag, '998'/, },
  { name: 'sign-tests/sign-fail-02', message: /Signature mismatch/, },
  { name: 'sign-tests/sign-fail-03', message: /Unknown algorithm, -999/, },
  { name: 'sign-tests/sign-fail-04', message: /Unknown algorithm, unknown/, },
  { name: 'sign-tests/sign-fail-06', message: /Signature mismatch/, },
  { name: 'sign-tests/sign-fail-07', message: /Signature mismatch/, },
  { name: 'sign1-tests/sign-fail-01', message: /Unexpected cbor tag, '998'/, },
  { name: 'sign1-tests/sign-fail-02', message: /Signature mismatch/, },
  { name: 'sign1-tests/sign-fail-03', message: /Unknown algorithm, -999/, },
  { name: 'sign1-tests/sign-fail-04', message: /Unknown algorithm, unknown/, },
  { name: 'sign1-tests/sign-fail-06', message: /Signature mismatch/, },
  { name: 'sign1-tests/sign-fail-07', message: /Signature mismatch/, },
].forEach(({ name, message }, i) => {
  test('verify ' + name, async (t) => {
    const { verifier, signature } = await readSigningTestData(`test/Examples/${name}.json`);
    await t.throwsAsync(cose.sign.verify(signature, verifier), { message });
  });
})