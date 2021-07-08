<template>
  <div>
    <el-card class="box-card">
      <Category @getCategoryID="getCategoryID"></Category>
    </el-card>

    <!-- 属性表格 -->
    <el-card class="box-card attr-card" v-show="isShowAdd">
      <!-- @click="handleAddShow" -->
      <el-button type="primary" icon="el-icon-plus" @click="isAttrFormShow">
        添加属性
      </el-button>
      <el-table :data="attrList" border style="width: 100%" class="attr-table">
        <el-table-column label="序号" type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="200">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row }">
            <el-tag
              type="danger"
              v-for="attrValue in row.attrValueList"
              style="margin-right: 10px"
            >
              {{ attrValue.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{ row }">
            <HintButton
              title="编辑"
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="isAttrFormShow(row)"
            ></HintButton>
            <HintButton
              title="删除"
              size="mini"
              icon="el-icon-delete"
              type="danger"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加属性和修改属性卡片 -->
    <el-card class="box-card attr-card" v-show="!isShowAdd">
      <el-form :inline="true" :model="attrForm" class="demo-form-inline">
        <el-form-item label="属性名">
          <el-input
            v-model="attrForm.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrForm.attrName"
        @click="addAttr"
      >
        添加属性值
      </el-button>
      <el-button type="defaule" @click="handleCancel">取消</el-button>
      <el-table
        :data="attrForm.attrValueList"
        border
        style="width: 100%"
        class="attr-table"
      >
        <el-table-column label="序号" type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="prop" label="属性值名称">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.valueName"
              placeholder="请输入属性值"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <HintButton
              title="删除"
              size="mini"
              icon="el-icon-delete"
              type="danger"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button type="defaule" @click="handleCancel">取消</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1id: "",
      category2id: "",
      category3id: "",
      isShowAdd: true,
      attrForm: {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: 0, //声明当前属性属于哪个分类id
        categoryLevel: 3, //声明categoryId是几级分类的
        // id: 0,
      },
      attrList: [],
    };
  },
  methods: {
    async getCategoryID({ id, level }) {
      // console.log(id, level);
      if (level === 1) {
        this.category1id = id;
        this.attrList = [];
      } else if (level === 2) {
        this.category2id = id;
        this.attrList = [];
      } else if (level === 3) {
        this.category3id = id;
        const { category1id, category2id, category3id } = this;
        if (category1id && category2id && category3id) {
          const { data } = await this.$API.attr.getAttrList(
            category1id,
            category2id,
            category3id
          );
          this.attrList = data;
          // console.log(data);
        } else {
          this.attrList = [];
        }
      }
    },
    // 添加和修改属性是否显示
    isAttrFormShow(row) {
      // console.log(1);
      this.isShowAdd = false;
      // console.log(row);
      // 编辑时要将当前行的属性值展示
      if (row.id) {
        this.attrForm = { ...row };
        console.log(this.attrForm);
      }
      // this.attrForm = row
    },
    handleCancel() {
      this.isShowAdd = true;
      this.attrForm.attrValueList = [];
    },
    addAttr() {
      // console.log(this);
      console.log(this.attrForm.isTrust);
      this.attrForm.attrValueList.push({
        attrId: "", // 添加没有这个id因为添加和修改是共用的一个接口，所以要兼容修改的功能
        valueName: "",
      });
    },
  },
  // computed(){
  //   getAttrList(){
  //     const {category1id,category2id,category3id} = this
  //     if (category1id&&category2id&&category3id) {
  //       const {data} = this.$API.attr.getAttrList(category1id,category2id,category3id)
  //     }
  //     return this.attrList = res.data
  //   }
  // }
};
</script>
<style>
.attr-table {
  margin: 20px 0;
}
.attr-card {
  margin-top: 20px;
}
</style>