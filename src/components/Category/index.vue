<template>
  <div>
    <!-- 三级分类 -->
    <el-form :inline="true" :model="attrForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="attrForm.category1id"
          placeholder="一级分类"
          @change="change1"
        >
          <el-option
            v-for="category in category1list"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="attrForm.category2id"
          placeholder="请选择"
          @change="change2"
        >
          <!-- <el-option label="区域一" value="shanghai">shanghai</el-option>
          <el-option label="区域二" value="beijing">beijing</el-option> -->
          <el-option
            v-for="category in category2list"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="attrForm.category3id"
          placeholder="请选择"
          @change="change3"
        >
          <el-option
            v-for="category in category3list"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      attrForm: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
      category1list: [],
      category2list: [],
      category3list: [],
    };
  },
  methods: {
    async getCategory1() {
      try {
        const res = await this.$API.category.getCategory1();
        // console.log(res);
        this.category1list = res.data;
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getCategory2() {
      try {
        const res = await this.$API.category.getCategory2(
          this.attrForm.category1id
        );
        this.category2list = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getCategory3() {
      try {
        const res = await this.$API.category.getCategory3(
          this.attrForm.category2id
        );
        this.category3list = res.data;
        //  console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    change1() {
      // console.log(1);
      this.getCategory2();
      this.attrForm.category2id = "";
      this.attrForm.category3id = "";
      this.$emit("getCategoryID", { id: this.attrForm.category1id, level: 1 });
    },
    change2() {
      this.getCategory3();
      this.attrForm.category3id = "";
      this.$emit("getCategoryID", { id: this.attrForm.category2id, level: 2 });
    },
    change3() {
      // console.log(3);
      this.$emit("getCategoryID", { id: this.attrForm.category3id, level: 3 });
    },
  },
  mounted() {
    this.getCategory1();
  },
};
</script>
<style>
</style>