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
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
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
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-select
          v-model="spuSaleAttrStr"
          :placeholder="
            unUseAttrList.length
              ? `还有${unUseAttrList.length}未选中`
              : '暂无属性可选'
          "
        >
          <el-option
            v-for="attrVal in unUseAttrList"
            :key="attrVal.id"
            :label="attrVal.name"
            :value="`${attrVal.id}:${attrVal.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spuSaleAttrStr"
          @click="addAttr"
          >添加销售属性</el-button
        >
        <el-table
          border=""
          style="margin: 20px 0"
          :data="spuForm.spuSaleAttrList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="属性名"
            width="150"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="(SaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="SaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row.spuSaleAttrValueList, index)"
              >
                {{ SaleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click.prevent="showInput(row)"
              >
                + 添加
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.saleAttrName}吗？`"
                @onConfirm="deleteAttrName($index)"
              >
                <!-- <HintButton
                  slot="reference"
                  title="删除"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                ></HintButton> -->
                <el-button
                  slot="reference"
                  title="删除"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr">保存</el-button>
        <el-button @click="handleCancle">取消</el-button>
      </el-form-item>
      <!-- SPU列表 -->
    </el-form>
  </el-card>
</template>

<script>
// const resetData = () => {
//   this.$options.data();
// };
export default {
  name: "spuForm",
  data() {
    return {
      spuForm: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "",
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
      dialogImageUrl: "",
      dialogVisible: false,
      inputVisible: false,
      spuSaleAttrStr: "",
      inputValue: "",
      trademarkList: [],
      spuImageList: [],
      baseSaleAttrList: [],
    };
  },
  props: ["isShowSpuForm", "category3Id"],
  methods: {
    // 删除图片成功的钩子
    handleRemove(file, fileList) {
      // file就是删除的图片信息，fileList就是剩余的图片列表
      console.log(file, fileList);
      this.spuForm.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片上传成功时的钩子，单方面在客户端删除添加数据并没有变，因此要在这些钩子中处理
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      // fileList就是添加后总共的图片数构成的数组
      this.spuForm.spuImageList = fileList;
    },
    // spu属性监听方法
    // 删除tag
    handleClose(spuSaleAttrValueList, index) {
      spuSaleAttrValueList.splice(index, 1);
    },

    // button 和 input 切换
    showInput(row) {
      // 为每一行设置响应式inputVisible
      this.$set(row, "inputVisible", true);
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },

    handleInputConfirm(row) {
      const { baseSaleAttrId, saleAttrName } = row;
      let inputValue = this.inputValue;
      // 看inputValue是否已存在
      const isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === inputValue;
      });
      // 判断属性值是否为空
      if (!inputValue.trim() && this.inputVisible) {
        this.$message.info("属性值不能为空!!!");
        return;
      }
      // 判断属性值是否已经存在
      if (isRepeat) {
        this.$message.info("属性值已存在!!!");
        return;
      }
      // 如果有值就添加，没有值不添加
      if (!isRepeat && inputValue) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId,
          saleAttrName,
          saleAttrValueName: inputValue,
        });
      }
      // else {
      //   this.$message.info("属性值不能为空!!!");
      // }
      row.inputVisible = false;
      this.inputValue = "";
    },
    // 初始化添加，两个请求
    initAdd() {
      this.getSaleAttrList();
      this.getTrademarks();
    },
    // 编辑的初始化更新，发送四个请求
    /* 
    更新SPU信息需要发送4个请求

​     1.获取SPU详细信息(在**spu**的api模块中声明)
​     GET /admin/product/getSpuById/{spuId}

​     2.获取SPU所有图片的列表信息(在**sku**的api模块中声明)
​     GET /admin/product/spuImageList/{spuId}

​     3.获取所有的销售属性信息(在**spu**的api模块中声明)
​     GET /admin/product/baseSaleAttrList

​     4.获取所有的品牌信息(在**trademark**的api模块中声明)
​     GET /admin/product/baseTrademark/getTrademarkList
    */
    initUpdate(id) {
      this.getSpuInfo(id);
      this.getSpuImageList(id);
      this.getSaleAttrList();
      this.getTrademarks();
    },

    // 获取spu基本信息
    async getSpuInfo(id) {
      console.log(1);
      const { data } = await this.$API.spu.getSpuInfo(id);
      console.log(data);
      this.spuForm = data;
    },
    // 获取spu图片
    async getSpuImageList(id) {
      const { data } = await this.$API.sku.getSpuImageList(id);
      console.log(data);
      data.forEach((item) => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      this.spuImageList = data;
      // this.spuImageList = data;
    },
    // 获取销售属性
    async getSaleAttrList() {
      const res = await this.$API.spu.getBaseSaleAttrList();
      // console.log(res);
      // res.data.forEach(item=>{
      //   item.isChecked = false
      // })
      this.baseSaleAttrList = res.data;
    },
    // 获取所有品牌
    async getTrademarks() {
      const res = await this.$API.trademark.getTrademarks();
      // console.log(res);
      this.trademarkList = res.data;
    },
    // 添加属性
    addAttr() {
      // 收集数据
      const [baseSaleAttrId, saleAttrName] = this.spuSaleAttrStr.split(":");
      // 给spuForm的spuSaleAttrValueList添加一条数据，且要符合接口需要的名称
      this.spuForm.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      // 清空数据
      this.spuSaleAttrStr = "";
    },
    // 删除属性
    deleteAttrName(index) {
      // 只需要删除客户端数据，保存时才发送请求
      this.spuForm.spuSaleAttrList.splice(index, 1);
      // 用户友好提示
      this.$message.success("删除成功!!!");
    },
    // 取消
    handleCancle() {
      // await this.$API.spu.addOrUpdate(this.spuForm);
      // 重新获取spu基本信息
      // this.getSpuInfo();
      this.$emit("update:isShowSpuForm", false);
      this.$emit("cancle");
      // 清空数据
      this.resetData();
    },
    resetData() {
      // 浅拷贝的方法
      Object.assign(this.$data, this.$options.data());
    },
    // 保存属性
    async saveAttr() {
      // 搜集数据，目前我们发送请求的数据是
      /*  spuForm:{
        category3Id: 0, //添加时是没有的，因为这个是我们发送请求获取的，最好通过父组件传递
        description: "", // 这个通过v-model搜集好了
        spuName: "", // 这个也是v-modle搜集好了
        tmId: "", // 这个也好了，品牌的名称
        // id: 0,
        spuImageList: [  // 图片这里我们必须经过修改才能有数据，而且我们上传的图片添加了name和url,真正需要的数据时下面这种，因此要处理
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
 */
      const { category3Id, spuForm, spuImageList } = this;
      spuForm.category3Id = category3Id;
      // 用户没有上传和删除时，spuForm.spuImageList没有数据，就用spuImageList里的
      spuForm.spuImageList = spuForm.spuImageList
        ? spuForm.spuImageList
        : spuImageList;
      // 原来图片上的
      /* 
        id:18
        imgName:"f73bfe30f5ec641a.jpg"
        imgUrl:"http://47.93.148.192:8080/group1/M00/00/02/rBHu8l-rgfWABhwlAAEjBwwVkrI735.jpg"
        name:"f73bfe30f5ec641a.jpg"
        spuId:3
        status:"success"
        uid:1625891589869
        url:"http://47.93.148.192:8080/group1/M00/00/02/rBHu8l-rgfWABhwlAAEjBwwVkrI735.jpg"
      */
      //  自己上传的
      /* 
      name:"2.jpg"
      percentage:100
      raw:File
      response:Object
      size:166257
      status:"success"
      uid:1625891791492
      url:"blob:http://localhost:9528/bc89a428-5916-4658-b251-240fe1ee480d"

    */
      // 实际需要的
      /* 
      {
          //   id: 0,
          //   imgName: "string", // 需要
          //   imgUrl: "string",  // 需要
          //   spuId: 0,
          // },
    */
      //  遍历所有的spuForm.spuImageList,处理数据
      const newSpuForm = spuForm.spuImageList.map((item) => {
        // 原来的图片
        if (item.imgUrl) {
          delete item.name;
          delete item.url;
          return item;
        } else {
          return {
            imgName: item.name,
            imgUrl: item.response.data,
          };
        }
      });
      spuForm.spuImageList = newSpuForm;
      // 发送请求
      try {
        await this.$API.spu.addOrUpdate(spuForm);
        // 添加成功用户提示
        this.$message.success("保存成功！！！");
        // 请求成功回到spu展示页面
        this.$emit("update:isShowSpuForm", false);
        // 通知父组件更新数据
        this.$emit("success");
        // 清空数据
        this.resetData();
      } catch (error) {
        this.$message.info("保存失败！！！");
      }
    },
  },
  computed: {
    unUseAttrList() {
      const {
        baseSaleAttrList,
        spuForm: { spuSaleAttrList },
      } = this;

      const unUse = {};

      // 将数组中的每一项都添加到空的对象中，这样所有的元素都会被添加到unUse中
      spuSaleAttrList.forEach((item) => {
        unUse[item.baseSaleAttrId] = true;
      });
      // console.log(unUse);
      // baseSaleAttrId
      return baseSaleAttrList.filter((item) => {
        return !unUse[item.id];
      });
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>