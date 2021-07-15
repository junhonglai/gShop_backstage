<template>
  <div>
    <!-- sku表格 -->
    <el-card class="box-card" v-show="!isShowSkuForm">
      <el-table
        :data="skuInfoList"
        border
        :stripe="true"
        style="width: 100%"
        class="trademark-table"
      >
        <el-table-column
          prop="date"
          label="序号"
          type="index"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="222">
        </el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="222">
        </el-table-column>
        <el-table-column label="默认图片" width="150" align="center">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt="商品图片"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="222">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80">
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="{ row }">
            <!-- 上架 -->
            <HintButton
              v-if="!row.isSale"
              icon="el-icon-top"
              title="上架"
              type="info"
              size="mini"
              @click="onSale(row)"
            ></HintButton>
            <!-- 下架 -->
            <HintButton
              v-else
              icon="el-icon-bottom"
              title="下架"
              type="success"
              size="mini"
              @click="cancelSale(row)"
            ></HintButton>
            <!-- 修改 -->
            <HintButton
              icon="el-icon-edit"
              title="修改"
              type="primary"
              size="mini"
              @click="updateSku(row)"
            ></HintButton>
            <!-- 查看详情 -->
            <HintButton
              style="margin-right: 10px"
              icon="el-icon-info"
              title="查看详情"
              type="info"
              size="mini"
              @click="check(row)"
            ></HintButton>
            <el-popconfirm
              :title="`确定删除${row.skuName}吗？`"
              @onConfirm="deleteSku(row)"
            >
              <!-- 删除 -->
              <HintButton
                slot="reference"
                icon="el-icon-delete"
                title="删除"
                type="danger"
                size="mini"
              ></HintButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!--  @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="text-align: center; margin-top: 20px"
        :current-page="page"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size="limit"
        layout="prev, pager, next, jumper,->, sizes, total"
        :total="total"
      >
        ></el-pagination
      >
    </el-card>
    <!-- skuForm -->
    <div class="box-card spu-card">
      <skuForm
        v-show="isShowSkuForm"
        :isShowSkuForm.sync="isShowSkuForm"
      ></skuForm>
    </div>
    <!-- 抽屉组件 -->
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      size="50%"
    >
      <!-- 名称 -->
      <el-row class="drower-row">
        <el-col :span="5" class="drower-title">名称</el-col>
        <el-col :span="16" class="drower-content">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <!-- 描述 -->
      <el-row class="drower-row">
        <el-col :span="5" class="drower-title">描述</el-col>
        <el-col :span="16" class="drower-content">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <!-- 价格 -->
      <el-row class="drower-row">
        <el-col :span="5" class="drower-title">价格</el-col>
        <el-col :span="16" class="drower-content">{{ skuInfo.price }}</el-col>
      </el-row>
      <!-- 平台属性 -->
      <el-row class="drower-row">
        <el-col :span="5" class="drower-title">平台属性</el-col>
        <el-col :span="16" class="drower-content"
          ><el-tag
            v-for="attrValue in skuInfo.skuAttrValueList"
            :key="attrValue.id"
            type="warning"
            style="margin-right: 5px"
            >{{ attrValue.attrName }}:{{ attrValue.valueName }}</el-tag
          >
        </el-col>
      </el-row>
      <!-- 商品图片 -->
      <el-row class="drower-row">
        <el-col :span="5" class="drower-title">商品图片</el-col>
        <el-col :span="16">
          <div>
            <!-- 轮播图 -->
            <el-carousel
              trigger="click"
              v-if="skuInfo.skuImageList"
              class="carousel-container"
            >
              <el-carousel-item
                v-for="img in skuInfo.skuImageList"
                :key="img.id"
                style="width: 400px; height: 400px"
              >
                <img
                  class="carousel-img"
                  :src="img.imgUrl"
                  style="width: 400px; height: 400px"
                />
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import skuForm from "../components/skuForm.vue";

export default {
  name: "SKU",
  components: {
    skuForm,
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 30,
      skuInfoList: [],
      skuInfo: {},
      isShowSkuForm: false,
      drawer: false,
    };
  },
  mounted() {
    console.log(1);
    this.getList();
  },
  methods: {
    // 监听每页条数变化
    handleSizeChange(value) {
      this.limit = value;
      this.getList();
    },
    // 监听当前页变化
    handleCurrentChange(value) {
      this.page = value;
      this.getList();
    },
    // 获取skuList列表
    async getList() {
      try {
        const res = await this.$API.sku.getList(this.page, this.limit);
        this.page = res.data.current;
        this.limit = res.data.size;
        this.total = res.data.total;
        this.skuInfoList = res.data.records;
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    //上架商品
    async onSale(row) {
      try {
        // 发送请求
        await this.$API.sku.onSale(row.id);
        // 用户友好提示
        this.$message.success("上架成功！！！");
        // 状态改为上架
        row.isSale = 1;
        // 重新请求新数据
        this.getList();
      } catch (error) {
        // 上架失败
        this.$message.info("上架失败！！！");
      }
    },
    // 下架商品
    async cancelSale(row) {
      try {
        // 发送请求
        await this.$API.sku.cancelSale(row.id);
        // 用户友好提示
        this.$message.success("下架成功！！！");
        // 状态改为下架
        row.isSale = 0;
        // 重新请求新数据
        this.getList();
      } catch (error) {
        // 下架失败
        this.$message.info("上架失败！！！");
      }
    },
    // 监听用户点击修改按钮
    async updateSku(row) {
      this.isShowSkuForm = true;
      // const res = await this.$API.sku.get(row.id);
      // console.log(res);
    },
    // 监听查看点击
    async check(row) {
      this.drawer = true;
      const res = await this.$API.sku.get(row.id);
      this.skuInfo = res.data;
      console.log(res);
    },
    // 删除sku
    async deleteSku(row) {
      try {
        // 发送请求
        await this.$API.sku.remove(row.id);
        // 请求成功，用户友好提示
        this.$message.success("删除成功！！！");
        // 重新请求数据
        this.getList();
      } catch (error) {
        // 请求失败，用户友好提示
        this.$message.info("删除失败！！！");
      }
    },
  },
};
</script>
<style lang="scss">
.drower-row {
  line-height: 40px;
  color: #303133;
  .drower-title {
    text-align: right;
    margin-right: 20px;
    font-size: 18px;
    font-weight: bold;
  }
  .drower-content {
    font-size: 16px;
  }
  .carousel-container {
    width: 400px;
    height: 400px;
  }
}
.el-carousel__indicators--horizontal {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.el-carousel__indicator .el-carousel__button {
  background-color: hotpink;
}
.el-carousel__arrow {
  top: 200px;
  transform: translateY(-50%);
}
</style>