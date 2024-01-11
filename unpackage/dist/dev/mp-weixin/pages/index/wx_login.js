"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
const _sfc_main = {
  __name: "wx_login",
  setup(__props) {
    const userinfo = common_vendor.ref({
      avatarUrl: "",
      nickName: "",
      openid: ""
    });
    const weixin = {
      jscode2sessionUrl: "https://api.weixin.qq.com/sns/jscode2session",
      appid: "wx434fb6d964669fc0",
      secret: "f6c87cf44eb444a80c19c630519463f0"
    };
    store_user.useUserStore();
    common_vendor.ref(null);
    async function wxlogin() {
      try {
        common_vendor.index.showLoading({ title: "授权进行中..." });
        const result = await common_vendor.index.getUserProfile({
          lang: "zh_CN",
          desc: "授权获得更多服务"
        });
        const { avatarUrl, nickName } = result.userInfo;
        const loginRes = await common_vendor.index.login({
          provider: "weixin"
        });
        const url = `${weixin.jscode2sessionUrl}?appid=${weixin.appid}&secret=${weixin.secret}&js_code=${loginRes.code}&grant_type=authorization_code`;
        const res2 = await common_vendor.index.request({
          url
        });
        userinfo.value.avatarUrl = avatarUrl;
        userinfo.value.nickName = nickName;
        userinfo.value.openid = res2.data.openid;
        common_vendor.index.setStorageSync("avatar", avatarUrl);
        saveUserInfoToLocal(userinfo.value);
        common_vendor.index.hideLoading();
        console.log("登录成功", userinfo.value);
      } catch (error) {
        console.log("授权失败", error);
        common_vendor.index.hideLoading();
      }
    }
    function saveUserInfoToLocal(userInfo) {
      try {
        const userInfoStr = JSON.stringify(userInfo);
        common_vendor.index.setStorageSync("userInfo", userInfoStr);
        console.log("用户信息已保存到localStorage");
      } catch (e) {
        console.log("保存用户信息失败", e);
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userinfo.value.avatarUrl
      }, userinfo.value.avatarUrl ? {
        b: userinfo.value.avatarUrl
      } : {}, {
        c: common_vendor.o(wxlogin)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-21645cb2"], ["__file", "C:/Users/Administrator/Desktop/H5考试材料/H5考试材料/uniapp-vue3-wx/pages/index/wx_login.vue"]]);
wx.createPage(MiniProgramPage);
