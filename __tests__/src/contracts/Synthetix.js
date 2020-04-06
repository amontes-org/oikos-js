import { SynthetixJs } from '../../../src/index.node.js';
import ContractSettings from '../../../src/contractSettings';
import { getDefaultProvider } from 'ethers';

const { SUPPORTED_NETWORKS } = ContractSettings;

const contract = 'Synthetix';

describe(`src/contracts/${contract}`, () => {
  Object.entries(SUPPORTED_NETWORKS).forEach(([networkId, network]) => {
    let snxjs;
    beforeAll(() => {
      snxjs = new SynthetixJs({ networkId });
    });

    test(`${network} Should return Synthetix total supply`, async () => {
      const totalSupply = await snxjs[contract].totalSupply();
      return expect(snxjs.utils.formatTron(totalSupply)).not.toBeNaN();
    });

    // TODO @kev we are not using the signers... figure out a way to use the
    // signers with tronweb?
    test.skip(`${network} Should throw Missing signer error`, async () => {
      await expect(snxjs[contract].mint()).rejects.toThrow(
        'sending a transaction require a signer'
      );
    });

    // JJ: older test
    test.skip(
      `${network} Should execute transaction signed with private key but fail on insufficient funds`,
      async () => {
        const signer = new SynthetixJs.signers.PrivateKey(
          getDefaultProvider(network === 'mainnet' ? undefined : network),
          networkId,
          '0x0123456789012345678901234567890123456789012345678901234567890123'
        );
        snxjs = new SynthetixJs({ signer, networkId });
        await expect(snxjs[contract].issueSynths(snxjs.util.parseTron('100'))).rejects.toThrow(
          'insufficient funds for gas * price + value'
        );
      },
      15000
    );
  });
});
