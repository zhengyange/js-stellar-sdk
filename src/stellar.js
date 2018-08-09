/**
 * 10.2.45.185
 * account1:
 * publicKey: GALG2TDUQXQCHBP3BUZECXR27OEOSLJGQRXJQTK2JOLHMUDRAA2C36AQ
 * secret: SBZB5RUKH6ZAYBQQO6SCGHMAE5XUUKR47ZFIAR2NEM7RH33QUOKZS374
 *
 * account2:
 * publicKey: GAX6WV4PRAHAG7SEUQUTV2H5ARAVBHWLYMHVFWAIAAQOM3IPIQA64E6T
 * secret: SBJS443TXKNK2AW6O2C76AF5Y5JTVMO2XYXCECMVXG7AZYWKUBEA7YNR
 *
 */

const $ = window.$;
const Stellar = {
  StellarSdk: window.StellarSdk,
  init() {
    this.createSecret();
  },
  createSecret() {
    const pair = this.StellarSdk.Keypair.random();
    return {
      secret: pair.secret(),
      publicKey: pair.publicKey(),
    };
  },
  createAccount(callback) {
    const keySecret = this.createSecret();
    console.log(keySecret);
    $.get('https://friendbot.stellar.org', {
      addr: keySecret.publicKey,
    }, (data) => {
      callback(data);
    });
  },
  loadAccount(publicKey, callback) {
    const server = new this.StellarSdk.Server('https://horizon-testnet.stellar.org');
    // the JS SDK uses promises for most actions, such as retrieving an account
    server.loadAccount(publicKey).then((account) => {
      if (callback) callback(account.balances);
    });
  },
};

export default Stellar;
