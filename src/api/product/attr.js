// DELETE /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark

// POST /admin/product/baseTrademark/save
// 新增BaseTrademark

// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark

// GET /admin/product/baseTrademark/{page}/{limit}
import request from "@/utils/request";

export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getAttrList(category1Id, category2Id, category3Id) {
    return request({
      method: "GET",
      url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    });
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  deleteAttr(attrId) {
    return request({
      method: "DELETE",
      url: `/admin/product/deleteAttr/${attrId}`
    });
  },

  // GET /admin/product/getAttrValueList/{attrId}
  getAttrValueList(attrId) {
    return request({
      method: "GET",
      url: `/admin/product/getAttrValueList/${attrId}`
    });
  },

  // POST /admin/product/saveAttrInfo
  saveAttrInfo(data) {
    return request({
      method: "POST",
      url: `/admin/product/saveAttrInfo`,
      data
    });
  }
};
