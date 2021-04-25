<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-header class="header">
      <div class="logo"></div>
    </a-layout-header>
    <a-layout-content style="padding: 0 2px">
      <a-layout style="padding: 2px 0; background: #fff">
        <a-layout-content>
          <a-layout>
            <a-layout-sider width="30%" style="background: #fff">
              <guider ref="guiderRef"></guider>
            </a-layout-sider>
            <a-layout-content :style="{ padding: '0 2px', minHeight: '280px' }">
              <ScanningPanel
                v-on:listenToScanningPanelInputEvent="fetchScannedBarcode"
              ></ScanningPanel>
            </a-layout-content>
          </a-layout>
        </a-layout-content>
        <a-layout-footer style="padding: 2px 0; background: #fff">
          <div>
            <a-collapse
              default-active-key="1"
              :bordered="false"
              expandIconPosition="right"
            >
              <a-collapse-panel key="1" header="当前工位最近操作记录">
                <ScanningLog ref="scanningLogRef"></ScanningLog>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-layout-footer>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Copyright &copy; 2021
      <a href="http://www.qiedan.cc" target="_blank"
        >深圳市企鹅蛋科技股份有限公司</a
      >
      出品
    </a-layout-footer>
  </a-layout>
</template>

<script>
import ScanningLog from "./log/ScanningLog";
import Guider from "./guider/Guider";
import ScanningPanel from "./scanning_panel/ScanningPanel";
export default {
  name: "scanning.vue",
  components: { ScanningPanel, Guider, ScanningLog },
  created() {},
  data: () => ({
    scannedBarcode: '',
  }),
  methods: {
    fetchScannedBarcode(v) {
      console.log("fetchScannedBarcode scannedBarcode:" + v);
      //this.$refs.guiderRef.initParams(this.v, 'LOGIN');
      this.scannedBarcode = v;
      console.log("initGuiderParams scannedBarcode:" + v);
      // push params to guider, log components
      this.$refs.guiderRef.initParams(this.scannedBarcode, 'LOGIN');
      this.$refs.scanningLogRef.initParams(this.scannedBarcode, 'LOGIN');
    }
  }
};
</script>

<style>
/*url('~@/assets/logo.jpeg');*/
#components-layout-demo-top-side .logo {
  width: 292px;
  height: 34px;
  margin: 16px 28px 16px 0;
  float: left;
  background: url('~@/assets/logo.jpeg');
}

#components-layout-demo-top-side .ant-layout-header,
#components-layout-demo-top-side .ant-layout-footer {
  background: #7dbcea;
  color: #fff;
}
</style>
