<template>
  <div>
    <!-- sku表格 -->
    <el-card class="box-card">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="trademark-table"
      >
        <el-table-column prop="date" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="222"> </el-table-column>
        <el-table-column prop="address" label="描述" width="222"> </el-table-column>
        <el-table-column prop="address" label="默认图片" width="150" align="center"> </el-table-column>
        <el-table-column prop="address" label="重量(KG)" width="222"> </el-table-column>
        <el-table-column prop="address" label="价格(元)" width="80">
        </el-table-column>
        <el-table-column prop="address" label="操作" width="250" align="center"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SKU",
  data() {
    return {
      tableData: [],
    };
  },
};
</script>
<style>
</style>