<template>
  <div class="component-confirmdialog">
    <el-dialog
      title=""
      :visible.sync="showDialogVisible"
      width="34%">
      <div class="dialog-title">Deposit to L2</div>
      <div class="dialog-des">Transfer assets from the layer1 wallet（e.g.connected MetaMask wallet）to the EigeMoney l2 wallet to experience gas-low token transfer and asap. you can withdraw assets to the layer1 wallet at any time.</div>
      <div class="dialog-rec">Recipient</div>
      <div class="dialog-status-box">
        <img src="~@/assets/dialog/dialog-sucess.png" class="status-icon">
        <p class="status-txt">Transaction Confirmed!</p>
      </div>
      <div class="dialog-amount-box">
        <div class="amount-type">Deposit Amount</div>
        <div class="amount-value">0.001ETH</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick" class="dialog-btn">Deposit</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ConfirmDialog',
  props: {
    dialogDes: {
      type: String,
    },
    dialogType: {
      type: String,
    },
    dialogVisible: {
      type: Boolean,
    }
  },
  watch: {
    dialogVisible() {
      this.showDialogVisible = this.dialogVisible
    }
  },
  data() {
    return {
      showDialogVisible: false,
      
    }
  },
  methods: {
    submitClick() {
      this.showDialogVisible = false
    },
  },
}
</script>
<style lang="scss" scoped>
  @import 'index';
</style>