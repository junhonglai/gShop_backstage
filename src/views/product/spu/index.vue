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
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="showSpuForm"
        :disabled="!category3id"
        >添加SPU</el-button
      >
      <el-table :data="spuList" border style="width: 100%" class="spu-table">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <HintButton
              title="添加SKU"
              type="success"
              size="mini"
              icon="el-icon-plus"
              @click="showSkuForm(row)"
            ></HintButton>
            <HintButton
              title="修改SPU"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showSpuForm(row)"
            ></HintButton>
            <HintButton
              style="margin-right: 10px"
              title="查看SKU列表"
              type="info"
              size="mini"
              icon="el-icon-info"
              @click="handleCheck(row)"
            ></HintButton>
            <el-popconfirm
              :title="`确定删除${row.spuName}吗？`"
              @onConfirm="deleteSpu(row.id)"
            >
              <HintButton
                slot="reference"
                title="删除SPU"
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></HintButton>
            </el-popconfirm>
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
      <spuForm
        v-show="isShowSpuForm"
        ref="spuForm"
        :isShowSpuForm.sync="isShowSpuForm"
        :category3Id="category3id"
        @success="success"
        @cancle="cancle"
      ></spuForm>
      <skuForm
        v-show="isShowSkuForm"
        ref="skuForm"
        :isShowSkuForm.sync="isShowSkuForm"
      ></skuForm>
    </div>
    <!-- dialog -->
    <el-dialog
      :title="`${spuName} => SKU列表`"
      :visible.sync="dialogTableVisible"
    >
      <!-- v-loading="!skuInfoList.length" -->
      <el-table border :data="skuInfoList">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格(元)" prop="price"></el-table-column>
        <el-table-column label="重量(KG)" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              :alt="row.skuName"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import spuForm from "../components/spuForm.vue";
import skuForm from "../components/skuForm.vue";

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
      spuName: "",
      isShowSpuForm: false,
      isShowSkuForm: false,
      dialogTableVisible: false,
      skuInfoList: [],
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
    async getSpuList(page) {
      const {
        data: { records, total },
      } = await this.$API.spu.getSpuList(
        page ? page : this.page,
        this.limit,
        this.category3id
      );
      if (page) {
        this.page = page;
      }
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
    showSpuForm(row) {
      this.isShowSpuForm = true;
      // 当spuForm显示时，通知其发送请求
      console.log(row.id);
      if (row.id) {
        // 有id就是修改
        this.flag = true;
        this.$refs.spuForm.initUpdate(row.id);
      } else {
        this.$refs.spuForm.initAdd();
      }
      // console.log(this.$refs.spuForm.spuForm);
    },
    // 用于监听点击添加SPU和修改SPU时showSkuForm的显示
    showSkuForm(spu) {
      console.log(spu);
      this.isShowSkuForm = true;
      const { category1id, category2id, category3id } = this;
      this.$refs.skuForm.initAdd(spu, category1id, category2id, category3id);
    },
    // 监听spuForm保存成功时重新获取数据
    success() {
      if (this.flag) {
        this.getSpuList();
      } else {
        this.getSpuList(1);
      }
      this.flag = false;
    },
    // 监听用户点击是取消时将标识flag置为false
    cancle() {
      this.flag = false;
    },
    // 删除spu
    async deleteSpu(id) {
      // console.log(1,id);
      try {
        // 发送请求
        await this.$API.spu.deleteSpu(id);
        this.getSpuList();
        this.$message.success("删除成功！！！");
      } catch (error) {
        this.$message.info("删除失败！！！");
      }
    },
    // 监听用户查看sku列表
    async handleCheck(row) {
      this.spuName = row.spuName;
      // 发送请求
      try {
        const res = await this.$API.sku.getSkuList(row.id);
        this.skuInfoList = res.data;
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
      this.dialogTableVisible = true;
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