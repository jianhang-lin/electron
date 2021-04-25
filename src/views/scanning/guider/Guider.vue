<template>
  <div>
    <a-card hoverable style="width: 240px">
      <img
        slot="cover"
        alt="example"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      />
      <a-card-meta title="欢迎登录工位平台">
        <template slot="description"> {{scannedBarcode}}</template>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "Guider",
  data: () => ({
    cmd: "",
    scannedBarcode: "",
  }),
  methods: {
    initParams(scannedBarcode, cmd) {
      console.log('Guider initScannedBarcode..');
      this.scannedBarcode = scannedBarcode;
      this.cmd = cmd;
      console.log('scannedBarcode=' + this.scannedBarcode + ', cmd=' + this.cmd);
    }
  }
};
</script>

<style scoped></style>
