<template>
  <div class="hello-wrap">
    <div class="op-wrap"></div>
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
  created() {
    Stellar.loadAccount('GAQDHK47ZI5CLLISUFIULD62YWSB2DY4ASDDZ5YKF35W66DBHOARCJDL', (data) => {
      this.account1Balance = data;
    });
    // Stellar.loadAccount('GA4C4R75HIQGGR6HQIII4PVDX2IME5CI5C2JVC24VGCCAJBRJRZAQ4CE', (data) => {
    //   this.account2Balance = data;
    // });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello-wrap{position: relative;}

</style>
