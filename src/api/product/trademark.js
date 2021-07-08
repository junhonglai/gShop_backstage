// DELETE /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark

// POST /admin/product/baseTrademark/save
// 新增BaseTrademark

// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark

// GET /admin/product/baseTrademark/{page}/{limit}
import request from "@/utils/request";

export default {
  // 删除
  deleteTrademark(id) {
    return request({
      method: "DELETE",
      url: `/admin/product/baseTrademark/remove/${id}`
    });
  },
  // 添加或更新
  addOrUpdate(options) {
    if (options.id) {
      return request({
        method: "PUT",
        url: `/admin/product/baseTrademark/update`,
        data: options
      });
    } else {
      return request({
        method: "POST",
        url: `/admin/product/baseTrademark/save`,
        data: options
      });
    }
  },
  // 获取品牌
  getTrademark(page,limit){
    return request({
      method:'GET',
      url:`/admin/product/baseTrademark/${page}/${limit}`
    })
  }
};
