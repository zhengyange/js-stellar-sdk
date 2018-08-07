/**
 * account1:
 * publicKey: GCDXMZLEOR6N5YOQIM2DKXZUUIFJNH6N65LVBHX2HJFAQUG52FBB2I2Y
 * secret: SDSE4SNZBPNZY2UZKDOR4QZVB4RDH7EUETMC3YVZQPTUC3B7MMUR7HLM
 *
 * account1:
 * publicKey: GA4C4R75HIQGGR6HQIII4PVDX2IME5CI5C2JVC24VGCCAJBRJRZAQ4CE
 * secret: SDSVJJI4UXAH3VIRUCUNLSCH73HHXPWU2VPUQ5O2KZJDUAF5O475ZP3I
 *
 */

const $ = window.$;
const Stellar = {
  StellarSdk: window.StellarSdk,
  init() {
    this.createSecret();
  },
  createSecret() {
    if (localStorage.getItem('secret')) {
      return {
        secret: localStorage.getItem('secret'),
        publicKey: localStorage.getItem('publicKey'),
      };
    }
    const pair = this.StellarSdk.Keypair.random();
    const secret = pair.secret();
    const publicKey = pair.publicKey();
    localStorage.setItem('secret', secret);
    localStorage.setItem('publicKey', publicKey);
    return {
      secret: pair.secret(),
      publicKey: pair.publicKey(),
    };
  },
  createAccount(callback) {
    if (localStorage.getItem('account')) {
      return callback(JSON.parse(localStorage.getItem('account')));
    }
    $.get('https://friendbot.stellar.org', {
      addr: localStorage.getItem('publicKey'),
    }, (data) => {
      callback(data);
      localStorage.setItem('account', JSON.stringify(data));
    });
    return false;
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
