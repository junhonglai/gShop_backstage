<template>
  <div>
    <el-card class="box-card">
      <Category
        @getCategoryID="getCategoryID"
        :isShowAdd="isShowAdd"
      ></Category>
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
            <el-popconfirm
              :title="`确定删除${row.attrName}吗？`"
              @onConfirm="removeAttr(row)"
            >
              <HintButton
                slot="reference"
                title="删除"
                size="mini"
                icon="el-icon-delete"
                type="danger"
              ></HintButton>
            </el-popconfirm>
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
              ref="inputVal"
              v-if="row.isEdit"
              @blur="toLock(row)"
            ></el-input>
            <div v-else @click="toEdit(row)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-popconfirm
              :title="`确定删除${row.valueName}吗？`"
              @onConfirm="deleteVal(row.$index)"
            >
              <HintButton
                title="删除"
                size="mini"
                icon="el-icon-delete"
                type="danger"
                slot="reference"
              ></HintButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="savaAttr">保存</el-button>
      <el-button type="defaule" @click="handleCancel">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";

const resetAttrForm = () => ({
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
});
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
    // 接受子组件传递过来的categoryId
    async getCategoryID({ id, level }) {
      // console.log(id, level);
      if (level === 1) {
        this.category1id = id;
        // 切换类目，清空数据，否则客户端会有之前的数据展示
        this.attrList = [];
      } else if (level === 2) {
        this.category2id = id;
        this.attrList = [];
      } else if (level === 3) {
        this.category3id = id;
        // 发送请求，属性数据，当三个id都有时才发送请求
        this.getAttrList();
      }
    },
    async getAttrList() {
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
    },
    // 添加和修改属性是否显示
    isAttrFormShow(row) {
      // console.log(1);
      this.isShowAdd = false;
      // console.log(row);
      // 编辑时要将当前行的属性值展示
      if (row.id) {
        this.attrForm = cloneDeep(row);
        // console.log(this.attrForm);
      }
      // this.attrForm = row
      this.attrForm.attrValueList.forEach((item) => {
        this.$set(item, "isEdit", false);
      });
    },
    // 取消
    handleCancel() {
      this.isShowAdd = true;
      this.attrForm.attrValueList = [];
      this.attrForm.attrName = "";
    },
    // 添加属性
    addAttr() {
      // console.log(this);
      // console.log(this.attrForm.isTrust);
      this.attrForm.attrValueList.push({
        attrId: "", // 添加没有这个id因为添加和修改是共用的一个接口，所以要兼容修改的功能
        valueName: "",
        isEdit: true,
      });
    },
    // 属性值修改和添加的输入显示隐藏
    toLock(row) {
      // 判断是否已经存在该属性值
      const isOnly = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });
      if (isOnly) {
        this.$message.info("属性值已存在!!!");
        return;
      }

      // 判断属性值是否为空，为空提醒用户
      if (row.valueName) {
        row.isEdit = false;
        return;
      } else {
        this.$message({
          type: "info",
          message: "属性值不能为空!!!",
        });
      }
    },
    // 切换编辑状态
    toEdit(row) {
      row.isEdit = true;
      this.$nextTick(() => {
        this.$refs.inputVal.focus();
      });
    },
    // 删除属性值
    deleteVal(index) {
      // console.log(1);
      this.attrForm.attrValueList.splice(index, 1);
    },
    // 保存添加的属性
    async savaAttr() {
      const { attrForm, category3id } = this;
      attrForm.categoryId = category3id;

      // 如果属性名为空，不发送请求
      if (!attrForm.attrName) {
        this.$message.info("属性名不能为空");
        return;
      }

      // 属性值列表为空，不发送请求
      if (attrForm.attrValueList.length === 0) {
        this.$message.info("属性值不能为空");
        return;
      }
      // 处理数据，因为我们添加了isEdit属性，但是我们不需要这个
      attrForm.attrValueList.forEach((item) => {
        delete item.isEdit;
      });
      // 发送请求
      try {
        // console.log(1);
        await this.$API.attr.saveAttrInfo(attrForm);
        // console.log(2);
        this.$message.success("保存成功!!!");
        // 隐藏添加属性界面
        this.isShowAdd = true;
        // 清空数据，如果不清空，下次点击添加还会保留上一次的添加的数据
        this.attrForm = resetAttrForm();
        // 重新请求列表，发送请求，刷新客户端
        this.getAttrList();
      } catch (error) {
        this.$message.info("保存失败!!!");
      }
    },
    // 删除属性
    async removeAttr(row) {
      try {
        // console.log(this.$API.attr.deleteAttr);
        // console.log(row.id);
        await this.$API.attr.deleteAttr(row.id);
        // console.log(2);
        // 拥护友好提示
        this.$message.success("删除成功!!!");
        // console.log(3);
        // 重新请求数据，刷新客户端数据展示
        this.getAttrList();
      } catch (error) {
        this.$message.error("删除失败亲亲!!!");
      }
    },
  },
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