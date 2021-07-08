<template>
  <div>
    <el-card class="box-card">
      <!-- 三级分类 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select v-model="formInline.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai">shanghai</el-option>
            <el-option label="区域二" value="beijing">beijing</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai">shanghai</el-option>
            <el-option label="区域二" value="beijing">beijing</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai">shanghai</el-option>
            <el-option label="区域二" value="beijing">beijing</el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- spu表格 -->
    <el-card class="box-card spu-card">
      <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
      <el-table :data="tableData" border style="width: 100%" class="attr-table">
        <el-table-column prop="date" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="name" label="属性名称"> </el-table-column>
        <el-table-column prop="address" label="属性值列表"> </el-table-column>
        <el-table-column prop="address" label="操作"> </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
      <el-pagination
        :current-page="1"
        :page-sizes="[2, 5, 10]"
        :page-size="2"
        layout="prev, pager, next, jumper,->,sizes, total"
        :total="0"
        class="spu-pagination"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SPU",
  data() {
    return {
      formInline: {
        region: [],
      },
      tableData: [],
    };
  },
};
</script>
<style>
.spu-pagination {
  text-align: center;
}
.spu-card {
  margin-top: 20px;
}
</style>