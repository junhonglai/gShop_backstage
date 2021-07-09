<template>
  <div>
    <el-card class="box-card">
      <Category
        @getCategoryID="getCategoryID"
        :isShowAdd="isShowAdd"
      ></Category>
    </el-card>
    <!-- spu表格 -->
    <el-card class="box-card spu-card" v-show="isShowAdd">
      <el-button type="primary" icon="el-icon-plus" @click="showSpuForm"
        >添加SPU</el-button
      >
      <el-table :data="spuList" border style="width: 100%" class="spu-table">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <HintButton
              title="添加SKU"
              type="success"
              size="mini"
              icon="el-icon-plus"
              @click="showSkuForm"
            ></HintButton>
            <HintButton
              title="修改SPU"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showSpuForm"
            ></HintButton>
            <HintButton
              title="查看SKU列表"
              type="info"
              size="mini"
              icon="el-icon-info"
            ></HintButton>
            <HintButton
              title="删除SPU"
              type="danger"
              size="mini"
              icon="el-icon-delete"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 5, 10]"
        :page-size="limit"
        layout="prev, pager, next, jumper,->,sizes, total"
        :total="total"
        class="spu-pagination"
      >
      </el-pagination>
    </el-card>
    
    <div class="box-card spu-card">
      <spuForm v-show="isShowSpuForm"></spuForm>
      <skuForm v-show="isShowSkuForm"></skuForm>
    </div>
  </div>
</template>

<script>
import spuForm from "./spuForm.vue";
import skuForm from "./skuForm.vue";

export default {
  name: "SPU",
  data() {
    return {
      category1id: "",
      category2id: "",
      category3id: "",
      page: 0,
      limit: 2,
      total: 0,

      spuList: [],
      isShowSpuForm: false,
      isShowSkuForm: false,
    };
  },
  components: {
    spuForm,
    skuForm,
  },
  methods: {
    // 接受子组件传递过来的categoryId
    async getCategoryID({ id, level }) {
      // console.log(id, level);
      if (level === 1) {
        this.category1id = id;
        // 切换类目，清空数据，否则客户端会有之前的数据展示
        this.spuList = [];
      } else if (level === 2) {
        this.category2id = id;
        this.spuList = [];
      } else if (level === 3) {
        this.category3id = id;
        // 发送请求，属性数据，当三个id都有时才发送请求
        this.getSpuList();
      }
    },

    // 请求spu列表
    async getSpuList() {
      const {
        data: { records, total },
      } = await this.$API.spu.getSpuList(
        this.page,
        this.limit,
        this.category3id
      );
      this.total = total;
      this.spuList = records;
      // console.log(records, total);
      // console.log(res.data);
    },

    // 用于监听每页条数的变化
    handleSizeChange(value) {
      this.limit = value;
      this.getSpuList();
    },

    // 用于监听当前页的变化
    handleCurrentChange(value) {
      this.page = value;
      this.getSpuList();
    },

    // 用于监听点击添加SPU和修改SPU时spuForm的显示
    showSpuForm() {
      this.isShowSpuForm = true;
    },
    // 用于监听点击添加SPU和修改SPU时showSkuForm的显示
    showSkuForm() {
      this.isShowSkuForm = true;
    },
  },
  computed: {
    isShowAdd() {
      const { isShowSpuForm, isShowSkuForm } = this;
      return !isShowSpuForm && !isShowSkuForm;
    },
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
.spu-table {
  margin: 20px 0;
}
</style>