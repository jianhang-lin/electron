<template>
  <div>
    <a-collapse
      default-active-key="1"
      :bordered="false"
      expandIconPosition="right"
    >
      <a-collapse-panel key="1" :header="headerTitle">
        <a-alert
          :message="alertMessage"
          :type="alertType"
          show-icon
          :hidden="hiddenAlert"
        />
        <a-form
          layout="vertical"
          :form="form"
          v-bind="formItemLayout"
          @submit="handleSubmit"
        >
          <a-input
            placeholder="请扫工位、用户、托盘和必须的子板"
            v-model="scannedBarcode"
            @pressEnter="queryScanningForm"
          />
        </a-form>
        <a-row>
          <a-col :span="8">
            <a-form-item label="当前工位：">
              <span class="ant-form-text">
                {{ this.scan.ws_no }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="当前工序：">
              <span class="ant-form-text">
                {{ this.scan.process_no }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="当前指令：">
              <span class="ant-form-text">
                {{ this.scan.cmd }}
              </span>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item label="工单号：">
              <span class="ant-form-text">
                {{ this.scan.wo_no }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="托盘/容器/BOX：">
              <span class="ant-form-text">
                {{ this.scan.pb_no }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="当前批号：">
              <span class="ant-form-text">
                {{ this.scan.batch_no }}
              </span>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item label="当前批次包含数量：">
              <span class="ant-form-text">
                {{ this.scan.batch_qty }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="默认条码类型：">
              <span class="ant-form-text">
                {{ this.scan.serial_list }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="备注：">
              <span class="ant-form-text">
                {{ this.scan.remark }}
              </span>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="8">
            <a-form-item label="用户：">
              <span class="ant-form-text">
                {{ this.scan.user }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="默认指令列表：">
              <span class="ant-form-text">
                {{ this.scan.cmd_list }}
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8"> </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export const StepEnum = {
  Workstation: { value: "Workstation" },
  User: { value: "User" },
  Cmd: { value: "WO_REC_MAT,MAT_WARM,MAT_DEFOAM,PASS,JOIN_WO" },
  WO_REC_MAT: { value: "WO_REC_MAT" },
  RECORD_WO_REC_MAT: { value: "RECORD_WO_REC_MAT" },
  MAT_WARM: { value: "MAT_WARM" },
  RECORD_MAT_WARM: { value: "RECORD_MAT_WARM" },
  MAT_DEFOAM: { value: "MAT_DEFOAM" },
  RECORD_MAT_DEFOAM: { value: "RECORD_MAT_DEFOAM" },
  PASS: { value: "PASS" },
  RECORD_PASS: { value: "RECORD_PASS" },
  JOIN_WO: { value: "JOIN_WO" },
  RECORD_JOIN_WO: { value: "RECORD_JOIN_WO" }
};
export default {
  name: "ScanningPanel",
  data: () => ({
    headerTitle: "请扫描当前工位",
    scannedBarcode: "",
    formItemLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    },
    scan: {
      nextStep: StepEnum.Workstation.value,
      ws_no: "",
      process_no: "",
      cmd: "",
      wo_no: "",
      pb_no: "",
      batch_no: "",
      batch_qty: "",
      serial_list: "",
      remark: "",
      user: "",
      cmd_list: ""
    },
    scanResponseData: {
      data: {},
      message: "",
      notice_level: "",
      success: ""
    },
    alertMessage: "",
    alertType: "success",
    hiddenAlert: true
  }),
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "validate_other" });
  },
  created() {
    this.autoQueryWsAndUser();
  },
  methods: {
    autoQueryWsAndUser() {
      const wsNoValue = this.$route.query.ws_no;
      const userValue = this.$route.query.user;
      console.log('ws_no=' + wsNoValue + ', user=' + userValue);
      if (wsNoValue !== undefined && wsNoValue.length > 0) {
        this.scannedBarcode = wsNoValue;
        // this.queryScanningForm();
        this.submitScanData()
          .then(response=> {
            let dataTemp = response.data;
            this.scanResponseData = dataTemp;
            if (!this.scanResponseData.success) {
              this.callAlert(this.scanResponseData.message, "error", undefined);
              return;
            }
            // success submit ws_no
            if (userValue !== undefined && userValue.length > 0) {
              this.scannedBarcode = userValue;
              this.submitScanData()
                .then(response=> {
                  let dataTemp = response.data;
                  this.scanResponseData = dataTemp;
                  // success submit user
                  if (!this.scanResponseData.success) {
                    this.callAlert(this.scanResponseData.message, "error", undefined);
                    return;
                  }
                  this.callAlert(this.scanResponseData.message, "success", undefined);
                  if (this.scanResponseData.data) {
                    this.headerTitle = this.scanResponseData.data.process_no;
                  }
                  this.scannedBarcode = "";
                  this.scan.ws_no = this.scanResponseData.data.ws_no;
                  this.scan.process_no = this.scanResponseData.data.process_no;
                  this.scan.cmd = this.scanResponseData.data.cmd;
                  this.scan.remark = this.scanResponseData.data.remark;
                  this.scan.cmd_list = this.scanResponseData.data.cmd_list;
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    queryScanningForm() {
      console.log("ScanningPanel:" + this.scannedBarcode);
      this.$emit("listenToScanningPanelInputEvent", this.scannedBarcode);
      this.submitScanData()
        .then(response => {
          console.log(response);
          let dataTemp = response.data;
          this.scanResponseData = dataTemp;
          if (!this.scanResponseData.success) {
            this.callAlert(this.scanResponseData.message, "error", undefined);
            return;
          }
          this.callAlert(this.scanResponseData.message, "success", undefined);
          if (this.scanResponseData.data) {
            this.headerTitle = this.scanResponseData.data.process_no;
          }
          this.scannedBarcode = "";
          this.scan.ws_no = this.scanResponseData.data.ws_no;
          this.scan.process_no = this.scanResponseData.data.process_no;
          this.scan.cmd = this.scanResponseData.data.cmd;
          this.scan.remark = this.scanResponseData.data.remark;
          this.scan.cmd_list = this.scanResponseData.data.cmd_list;
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitScanData() {
      let queryDataUrl = `${this.baseURL}/submitScanData?&scannedBarcode=${this.scannedBarcode}&wo=&i_cmd=${this.scannedBarcode}&json_data=`;
      let params = new FormData();
      let user = undefined; // Vue.ls.get(USER_INFO);
      let jsonData = {};
      jsonData.companyID = 43; //window._CONFIG['companyID'];
      jsonData.workstationID = null;
      if (user && user.userId) {
        jsonData.userID = user.userId;
      } else {
        jsonData.userID = null;
      }
      jsonData.sessionID = null;
      jsonData.filterData = {};
      jsonData.filterData.ws = this.scannedBarcode;

      queryDataUrl += JSON.stringify(jsonData)
        .replace(/{/g, "%7B")
        .replace(/}/g, "%7D")
        .replace(/\[/g, "%5B")
        .replace(/\]/g, "%5D");
      /*queryDataUrl += `&scannedBarcode=${this.scannedBarcode}`;
      queryDataUrl += `&wo=`;
      queryDataUrl += `&i_cmd=${this.scannedBarcode}`;*/

      /*params.append('json_data', JSON.stringify(jsonData));
      params.append('scannedBarcode', this.scannedBarcode);
      params.append('wo', '');
      params.append('i_cmd', this.scannedBarcode);*/
      //let getSubmitScanDataUrl = `${this.baseURL}/submitScanData?_dc=1619276499115&json_data=${jsonDataStr}&scannedBarcode=${this.scannedBarcode}&wo=&i_cmd=${this.scannedBarcode}`;
      return this.axios({
        headers: {
          Accept: "*/*",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        url: queryDataUrl,
        method: "get"
        // data: params
      });
    },
    errorMsg(content) {
      this.$message.error(content);
    },
    successMsg(content) {
      this.$message.success(content);
    },
    callAlert(msg, type, state) {
      this.alertMessage = msg;
      this.alertType = type;
      this.hiddenAlert = state;
    }
  }
};
</script>

<style scoped></style>
