// DELETE /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark

// POST /admin/product/baseTrademark/save
// 新增BaseTrademark

// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark

// GET /admin/product/baseTrademark/{page}/{limit}
import request from "@/utils/request";

export default {
  // 获取品牌
  getCategory1(){
    return request({
      method:'GET',
      url:`/admin/product/getCategory1`
    })
  },
  getCategory2(category1Id){
    return request({
      method:'GET',
      url:`/admin/product/getCategory2/${category1Id}`
    })
  },
  getCategory3(category2Id){
    return request({
      method:'GET',
      url:`/admin/product/getCategory3/${category2Id}`
    })
  }
};
