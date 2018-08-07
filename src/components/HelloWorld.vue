<template>
  <div class="hello-wrap">
    <div class="op-wrap">
      <div type="primary" @click="handleCreateAccount">创建帐户</div>
      <div type="primary" @click="handleLoadAccount1">加载帐户1</div>
      <div type="primary" @click="handleLoadAccount2">加载帐户2</div>
      <div type="primary" @click="handleTransaction">转帐1To2</div>
    </div>
    <table>
      <th><td>帐户1</td><td></td></th>
      <tr><td>publicKey:</td><td>xxxxxxxxxxxxxxxxxxxx</td></tr>
      <tr v-for="(item, key) in account1Balance" :key="`item1${key}`">
        <td>{{`Balance${key+1}`}}</td><td>{{item.balance}}</td>
      </tr>
    </table>
    <br />
    <table>
      <th><td>帐户2</td><td></td></th>
      <tr><td>publicKey:</td><td>xxxxxxxxxxxxxxxxxxxx</td></tr>
      <tr v-for="(item, key) in account2Balance" :key="`item1${key}`">
        <td>{{`Balance${key+1}`}}</td><td>{{item.balance}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import Stellar from '../stellar';

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      account1Balance: [],
      account2Balance: [],
    };
  },
  methods: {
    handleCreateAccount() {
      Stellar.createAccount((data) => {
        console.log(data);
      });
    },
    handleLoadAccount1() {
      Stellar.loadAccount('GALG2TDUQXQCHBP3BUZECXR27OEOSLJGQRXJQTK2JOLHMUDRAA2C36AQ', (data) => {
        this.account1Balance = data;
      });
    },
    handleLoadAccount2() {
      Stellar.loadAccount('GAX6WV4PRAHAG7SEUQUTV2H5ARAVBHWLYMHVFWAIAAQOM3IPIQA64E6T', (data) => {
        this.account2Balance = data;
      });
    },
    handleTransaction() {
      const StellarSdk = window.StellarSdk;
      StellarSdk.Network.useTestNetwork();
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
      const sourceKeys = StellarSdk.Keypair
        .fromSecret('SBZB5RUKH6ZAYBQQO6SCGHMAE5XUUKR47ZFIAR2NEM7RH33QUOKZS374');
      const destinationId = 'GAX6WV4PRAHAG7SEUQUTV2H5ARAVBHWLYMHVFWAIAAQOM3IPIQA64E6T';
      // Transaction will hold a built transaction we can resubmit if the result is unknown.
      let transaction = null;

      // First, check to make sure that the destination account exists.
      // You could skip this, but if the account does not exist, you will be charged
      // the transaction fee when the transaction fails.
      server.loadAccount(destinationId)
        // If the account is not found, surface a nicer error message for logging.
        .catch(StellarSdk.NotFoundError, () => {
          // sdf
          throw new Error('The destination account does not exist!');
        })
        // If there was no error, load up-to-date information on your account.
        .then(() => server.loadAccount(sourceKeys.publicKey()))
        .then((sourceAccount) => {
          // Start building the transaction.
          transaction = new StellarSdk.TransactionBuilder(sourceAccount)
            .addOperation(StellarSdk.Operation.payment({
              destination: destinationId,
              // Because Stellar allows transaction in many currencies, you must
              // specify the asset type. The special "native" asset represents Lumens.
              asset: StellarSdk.Asset.native(),
              amount: '10',
            }))
            // A memo allows you to add your own metadata to a transaction. It's
            // optional and does not affect how Stellar treats the transaction.
            .addMemo(StellarSdk.Memo.text('Test Transaction'))
            .build();
          // Sign the transaction to prove you are actually the person sending it.
          transaction.sign(sourceKeys);
          // And finally, send it off to Stellar!
          return server.submitTransaction(transaction);
        })
        .then((result) => {
          console.log('Success! Results:', result);
        })
        .catch((error) => {
          console.error('Something went wrong!', error);
          // If the result is unknown (no response body, timeout etc.) we simply resubmit
          // already built transaction:
          // server.submitTransaction(transaction);
        });
      this.paymentMessage(server);
    },
    paymentMessage(server) {
      const that = this;
      function savePagingToken(token) {
        localStorage.setItem('paytoken', token);
        // In most cases, you should save this to a local database or file so that
        // you can load it next time you stream new payments.
      }

      function loadLastPagingToken() {
        return localStorage.getItem('paytoken');
        // Get the last paging token from a local database or file
      }
      const accountId = 'GAX6WV4PRAHAG7SEUQUTV2H5ARAVBHWLYMHVFWAIAAQOM3IPIQA64E6T';

      // Create an API call to query payments involving the account.
      const payments = server.payments().forAccount(accountId);

      // If some payments have already been handled, start the results from the
      // last seen payment. (See below in `handlePayment` where it gets saved.)
      const lastToken = loadLastPagingToken();
      if (lastToken) {
        payments.cursor(lastToken);
      }

      // `stream` will send each recorded payment, one by one, then keep the
      // connection open and continue to send you new payments as they occur.
      payments.stream({
        onmessage(payment) {
          // Record the paging token so we can start from here next time.
          savePagingToken(payment.paging_token);

          // The payments stream includes both sent and received payments. We only
          // want to process received payments here.
          if (payment.to !== accountId) {
            return;
          }

          // In Stellar’s API, Lumens are referred to as the “native” type. Other
          // asset types have more detailed information.
          let asset;
          if (payment.asset_type === 'native') {
            asset = 'lumens';
          } else {
            asset = `${payment.asset_code}:${payment.asset_issuer}`;
          }

          // console.log(payment.amount + ' ' + asset + ' from ' + payment.from);
          console.log(`${payment.amount}  ${asset} from ${payment.from}`);
          that.handleLoadAccount1();
          that.handleLoadAccount2();
        },
        onerror() {
          console.error('Error in payment stream');
        },
      });
    },
  },
  created() {
    this.handleLoadAccount1();
    this.handleLoadAccount2();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello-wrap{position: relative;}

</style>
