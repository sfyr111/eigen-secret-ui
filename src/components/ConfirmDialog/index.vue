<template>
  <div class="component-confirmdialog">
    <el-dialog
      title=""
      :visible.sync="showDialogVisible"
      width="34%"
      :before-close="closeDialog">
      <div class="dialog-title">{{dialogType}} to L2</div>
      <div class="dialog-des">{{dialogDes}}</div>
      <div class="dialog-rec">Recipient</div>
      <div class="dialog-status-box">
        <img src="~@/assets/dialog/dialog-sucess.png" class="status-icon">
        <p class="status-txt">Transaction Confirmed!</p>
      </div>
      <div class="dialog-amount-box">
        <div class="amount-type">{{dialogType}} Amount</div>
        <div class="amount-value">0.001ETH</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick" class="dialog-btn">{{dialogType}}</el-button>
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
      this.closeDialog()
    },
    closeDialog() {
      this.showDialogVisible = false
      this.$emit('update:dialogVisible', false)
    },
  },
}
</script>
<style lang="scss" scoped>
  @import 'index';
</style>