<template>
  <div class="component-confirmdialog">
    <el-dialog
      :visible.sync="showDialogVisible"
      :show-close="false"
      width="34%"
      >
      <div class="dialog-title" v-if="dialogTitle">{{dialogTitle}}</div>
      <div class="dialog-des" v-if="dialogDes">{{dialogDes}}</div>
      <div class="dialog-status-box">
        <img src="~@/assets/dialog/dialog-sucess.png" class="status-icon">
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
