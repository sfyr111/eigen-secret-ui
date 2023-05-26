<template>
  <div class="component-confirmdialog">
    <el-dialog
      :visible.sync="showDialogVisible"
      :show-close="false"
      width="34%"
      >
      <div class="dialog-title" v-if="dialogTitle">{{dialogTitle}}</div>
      <div class="dialog-des" v-if="dialogDes">{{dialogDes ? dialogDes : 'System error'}}</div>
      <div class="dialog-status-box">
        <img v-if="dialogType == 0" src="~@/assets/dialog/dialog-sucess.png" class="status-icon">
        <img v-if="dialogType == 1" src="~@/assets/dialog/dialog-pending.png" class="status-icon">
        <img v-if="dialogType == 2" src="~@/assets/dialog/dialog-fail.png" class="status-icon">
        <p class="status-txt">{{ dialogTip }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick" class="dialog-btn">{{dialogBtnTxt}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AlertDialog',
  props: {
    dialogTitle: {
      type: String,
    },
    dialogBtnTxt: {
      type: String,
    },
    dialogTip: {
      type: String,
    },
    dialogDes: {
      type: String,
    },
    dialogType: {
      type: Number,
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
