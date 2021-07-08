<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >
    <!-- 品牌表格 -->
    <el-table
      :data="trademarkList"
      border
      style="width: 100%"
      class="trademark-table"
    >
      <el-table-column
        prop="date"
        label="序号"
        width="80"
        align="center"
        type="index"
      >
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" width="100" height="80" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showDialog(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="delelteTm(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 10, 20]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes, total"
      :total="total"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form :model="tmForm" :rules="rules" ref="tmForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="addTrademark"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      trademarkList: [],
      page: 1,
      limit: 3,
      total: 10,
      dialogFormVisible: false,
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      imageUrl: "",
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择图片", trigger: "blur" }],
      },
    };
  },
  async mounted() {
    this.getTrademark();
  },
  methods: {
    async getTrademark(page) {
      try {
        // console.log(this);
        const res = await this.$API.trademark.getTrademark(
          page ? page : this.page,
          this.limit
        );
        if (page) {
          this.page = page;
        }
        this.total = res.data.total;
        this.trademarkList = res.data.records;
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange(value) {
      // console.log(value);
      this.limit = value;
      this.getTrademark();
    },
    async handleCurrentChange(value) {
      // console.log(value);
      this.page = value;
      this.getTrademark();
    },

    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const types = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const isJPG = types.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    showDialog(row) {
      if (row.id) {
        this.tmForm = { ...row };
        this.$API.trademark.addOrUpdate(this.tmForm);
      }
      this.dialogFormVisible = true;
    },
    addTrademark(tmForm) {
      try {
        this.$refs.tmForm.validate(async (valid) => {
          if (valid) {
            // alert("submit!");
            // 发送请求保存
            await this.$API.trademark.addOrUpdate(this.tmForm);
            // 请求新的品牌列表
            this.getTrademark();
            this.$message({
              message: "恭喜，添加成功",
              type: "success",
            });
            // 隐藏dialog
            this.dialogFormVisible = false;
            this.tmForm = {
              tmName: "",
              logoUrl: "",
            };
          } else {
            this.$message.error("保存失败");
            // console.log("error submit!!");
            return false;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    handleCancel() {
      this.dialogFormVisible = false;
      // this.tmForm = {
      //   tmName: "",
      //   logoUrl: "",
      // };
    },
    delelteTm(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // try {
            // 发送删除请求
            await this.$API.trademark.deleteTrademark(row.id);
            // // // 请求新的品牌列表
            // if (this.page >= this.totalPage) {
            //   this.page = this.totalPage;
            //   console.log(this.page);
            //   // this.getTrademark();
            // }
            this.getTrademark(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
            // console.log(this.page);
            // 用户提示
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          // } catch (error) {
          //   console.log(error);
          // }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.tmForm = {
          tmName: "",
          logoUrl: "",
        };
      }
    },
  },
  // computed: {
  //   totalPage() {
  //     return Math.ceil(this.total / this.limit);
  //   },
  // },
};
</script>
<style>
.pagination {
  text-align: center;
}
.trademark-table {
  margin: 20px 0;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>