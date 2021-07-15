<template>
  <el-card>
    <el-form :model="skuForm" label-width="80px">
      <!-- spu名称 -->
      <el-form-item label="SPU名称">
        <span>{{ spuForm.spuName }}</span>
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
        <el-form :inline="true">
          <el-form-item
            v-for="attr in attrList"
            :key="attr.id"
            :label="attr.attrName"
            label-width="100px"
          >
            <el-select placeholder="请输入" v-model="attr.attrValueStr">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
            label-width="100px"
          >
            <el-select placeholder="请输入" v-model="saleAttr.saleAttrValueStr">
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.baseSaleAttrId}:${saleAttrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <!-- v-loading="!imageList.length" -->
        <el-table
          :data="imageList"
          border
          @select="handleSelect"
          @select-all="handleSlectAll"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                :alt="row.imgName"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.isDefault === '0'"
                type="primary"
                @click="handleDefault(row)"
                >设为默认</el-button
              >
              <el-tag v-else :disable-transitions="true">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 两个按钮 -->
      <el-form-item label="">
        <el-button type="primary" @click="saveSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "skuForm",
  props: ["isShowSkuForm"],
  data() {
    return {
      skuForm: {
        // 已经自动收集
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",

        // 父组件传递
        tmId: 0,
        spuId: 0,
        category3Id: "",

        skuDefaultImg: "",
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
        skuSaleAttrValueList: [
          //   {
          //     id: 0,
          //     saleAttrId: 0,
          //     saleAttrName: "string",
          //     saleAttrValueId: 0,
          //     saleAttrValueName: "string",
          //     skuId: 0,
          //     spuId: 0,
          //   },
        ],
        // spuId: 0,
        // tmId: 0,
      },
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuForm: {},
      saleAttrList: [],
      attrList: [],
      imageList: [],
      selectedImageList: [],
    };
  },
  methods: {
    async initAdd(spu, category1Id, category2Id, category3Id) {
      this.spuForm = spu;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      const promise1 = this.$API.sku.getSpuSaleAttrList(spu.id);
      const promise2 = this.$API.attr.getAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      const promise3 = this.$API.sku.getSpuImageList(spu.id);
      const [res1, res2, res3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);
      // 收集数据
      this.saleAttrList = res1.data;
      this.attrList = res2.data;
      // 处理图片
      const imageList = res3.data;
      imageList.forEach((item) => {
        item.isDefault = "0";
      });
      // 设置第一张是默认图片
      imageList[0].isDefault = "1";
      this.imageList = imageList;
      // 搜集默认图片url
      this.skuForm.skuDefaultImg = imageList[0].imgUrl;
    },
    // 监听点击设置默认图片
    handleDefault(row) {
      // console.log(row);
      // 先将所有的isDefault置为0
      this.imageList.forEach((item) => {
        item.isDefault = "0";
      });
      // 当前点击的图片置为默认
      row.isDefault = "1";
      this.skuForm.skuDefaultImg = row.imgUrl;
    },
    // 监听图片复选框点击
    handleSelect(value) {
      // console.log(value);
      // 将选中的图片收集到selectedImageList中
      this.selectedImageList = value;
    },
    // 箭筒图片全选点击
    handleSlectAll(value) {
      // console.log(value);
      // 将选中的图片收集到selectedImageList中
      this.selectedImageList = value;
    },
    resetData() {
      Object.assign(this.$data, this.$options.data());
    },
    // 保存当前修改的sku
    async saveSpu() {
      console.log(1);
      // 收集数据
      const {
        spuForm,
        skuForm,
        category3Id,
        selectedImageList,
        saleAttrList,
        attrList,
      } = this;
      // 父组件传递的数据
      skuForm.tmId = spuForm.tmId;
      skuForm.spuId = spuForm.id;
      skuForm.category3Id = category3Id;

      // 处理平台属性数据
      skuForm.skuAttrValueList = attrList.reduce((p, c) => {
        console.log(c.attrValueStr);
        const attrValueStr = c.attrValueStr;
        if (attrValueStr) {
          const [attrId, valueId] = attrValueStr.split(":");
          const obj = {
            attrId,
            valueId,
          };
          p.push(obj);
        }
        return p;
      }, []);

      // 处理销售属性数据
      skuForm.skuSaleAttrValueList = saleAttrList.reduce((p, c) => {
        console.log(c.saleAttrValueStr);
        const saleAttrValueStr = c.saleAttrValueStr;
        if (saleAttrValueStr) {
          const [saleAttrId, saleAttrValueId] = saleAttrValueStr.split(":");
          const obj = {
            saleAttrId,
            saleAttrValueId,
          };
          p.push(obj);
        }
        return p;
      }, []);
      // 处理图片数据
      skuForm.skuImageList = selectedImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
        //     id: 0,
        //     imgName: "string",
        //     imgUrl: "string",
        //     isDefault: "string",
        //     skuId: 0,
        //     spuImgId: 0,
      });
      // console.log(skuForm);
      // 发送请求
      try {
        await this.$API.sku.addOrUpdate(skuForm);
        // 请求成功，用户友好提示
        this.$message.success("保存成功");
        // 清空数据
        this.resetData();
      } catch (error) {
        // 请求失败提示
        this.$message.info("保存失败");
      }
      // 关闭skuForm
      this.$emit("update:isShowSkuForm", false);
    },
    // 监视用户点击取消
    cancel() {
      this.$emit("update:isShowSkuForm", false);
      // 清空数据
      this.resetData();
    },
  },
};
</script>
<style>
</style>