<template>
  <el-card>
    <el-form :model="skuForm" label-width="80px">
      <!-- spu名称 -->
      <el-form-item label="SPU名称">
        <span>大黄666</span>
      </el-form-item>
      <!-- sku名称 -->
      <el-form-item label="SKU名称">
        <el-input
          v-model="skuForm.skuName"
          placeholder=" 请输入SKU名称"
        ></el-input>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item label="价格(元)">
        <el-input
          type="number"
          v-model="skuForm.price"
          placeholder=" 请输入SKU价格"
        ></el-input>
      </el-form-item>
      <!-- 重量 -->
      <el-form-item label="重量(kg)">
        <el-input
          type="number"
          v-model="skuForm.weight"
          placeholder="请输入SKU重量"
        ></el-input>
      </el-form-item>
      <!-- 描述 -->
      <el-form-item label="规格描述">
        <el-input
          rows="4"
          type="textarea"
          v-model="skuForm.skuDesc"
          placeholder=" 请输入SKU规格描述"
        ></el-input>
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <el-form :model="skuForm">
          <el-form-item label="苹果">
            <el-select placeholder="请输入">
              <el-option label="oyx" value="oyx"></el-option>
              <el-option label="ljh" value="oyx"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form :model="skuForm">
          <el-form-item label="尺码">
            <el-select placeholder="请输入">
              <el-option label="oyx" value="oyx"></el-option>
              <el-option label="ljh" value="oyx"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <el-table :data="skuForm.skuImageList" border>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片"></el-table-column>
          <el-table-column label="名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      skuForm: {
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",
        // category3Id: 0,
        // createTime: "2021-07-10T07:13:25.796Z",
        // id: 0,
        // isSale: 0,

        skuAttrValueList: [
          //   {
          //     attrId: 0,
          //     attrName: "string",
          //     id: 0,
          //     skuId: 0,
          //     valueId: 0,
          //     valueName: "string",
          //   },
        ],
        // skuDefaultImg: "string",

        skuImageList: [
          //   {
          //     id: 0,
          //     imgName: "string",
          //     imgUrl: "string",
          //     isDefault: "string",
          //     skuId: 0,
          //     spuImgId: 0,
          //   },
        ],
        // skuSaleAttrValueList: [
        //   {
        //     id: 0,
        //     saleAttrId: 0,
        //     saleAttrName: "string",
        //     saleAttrValueId: 0,
        //     saleAttrValueName: "string",
        //     skuId: 0,
        //     spuId: 0,
        //   },
        // ],
        // spuId: 0,
        // tmId: 0,
      },
    };
  },
};
</script>
<style>
</style>