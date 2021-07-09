<template>
  <el-card>
    <el-form ref="form" :model="spuForm" label-width="80px">
      <!-- SPU名称 -->
      <el-form-item label="SPU名称">
        <el-input
          v-model="spuForm.spuName"
          placeholder="请输入SPU名称"
        ></el-input>
      </el-form-item>
      <!-- 品牌 -->
      <el-form-item label="品牌">
        <el-select v-model="trademarkList" placeholder="请选择品牌 ">
          <el-option
            v-for="(trademark, index) in trademarkList"
            :key="index"
            :label="trademark"
            :value="0"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- SPU描述 -->
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spuForm.description"
          placeholder="请输入SPU描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <!-- SPU照片墙 -->
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-select v-model="spuForm.spuSaleAttrList" placeholder="还有3未选中 ">
          <el-option
            v-for="spuSaleAttr in spuForm.spuSaleAttrList"
            :key="spuSaleAttr.id"
            :label="spuSaleAttr"
            :value="0"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table border="" style="margin:20px 0;">
          <el-table-column label="序号" type="index" width="80"></el-table-column>
          <el-table-column label="属性名" width="150"></el-table-column>
          <el-table-column label="属性值名称列表"></el-table-column>
          <el-table-column label="操作" width="150"></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
      <!-- SPU列表 -->
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      spuForm: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: 0,
        // id: 0,
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      trademarkList: [],
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 初始化添加，两个请求
    initAdd(){

    },
    // 编辑的初始化更新，发送四个请求
    initUpdate(){
      
    }
  },
};
</script>
<style>
</style>