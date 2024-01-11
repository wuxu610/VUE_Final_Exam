<template>
  <view>
    <view class="logo">
      <image v-if="userinfo.avatarUrl" :src="userinfo.avatarUrl" class="user-avatar"></image>
    </view>
    <button type="primary" @click="wxlogin">微信登录</button>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import useUserStore from '@/store/user.js';
import { postRequest } from '@/http/index.js';

const userinfo = ref({
  avatarUrl: '',
  nickName: '',
  openid: '',
});

const weixin = {
  jscode2sessionUrl: 'https://api.weixin.qq.com/sns/jscode2session',
  appid: 'wx434fb6d964669fc0',
  secret: 'f6c87cf44eb444a80c19c630519463f0',
};

const userStore = useUserStore();
const myForm = ref(null);

async function wxlogin() {
  try {
    uni.showLoading({ title: '授权进行中...' });
    const result = await uni.getUserProfile({
      lang: 'zh_CN',
      desc: '授权获得更多服务',
    });
    const { avatarUrl, nickName } = result.userInfo;

    const loginRes = await uni.login({
      provider: 'weixin',
    });
    const url = `${weixin.jscode2sessionUrl}?appid=${weixin.appid}&secret=${weixin.secret}&js_code=${loginRes.code}&grant_type=authorization_code`;
    const res2 = await uni.request({
      url: url,
    });

    userinfo.value.avatarUrl = avatarUrl;
    userinfo.value.nickName = nickName;
    userinfo.value.openid = res2.data.openid;
	uni.setStorageSync('avatar', avatarUrl);

    // 保存用户信息到localStorage
    saveUserInfoToLocal(userinfo.value);

    uni.hideLoading();
    console.log('登录成功', userinfo.value);
  } catch (error) {
    console.log('授权失败', error);
    uni.hideLoading();
  }
}

function saveUserInfoToLocal(userInfo) {
  try {
    // 使用JSON.stringify将对象转换为字符串，然后保存到localStorage
    const userInfoStr = JSON.stringify(userInfo);
    uni.setStorageSync('userInfo', userInfoStr);
    console.log('用户信息已保存到localStorage');
  } catch (e) {
    console.log('保存用户信息失败', e);
  }
}

</script>
<style scoped>
.myForm {
	padding: 40px 10px 0 10px;
	margin: 10px;
	height: calc(80vh - 240px);
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
	border-radius: 0 0 10px 10px;
}
.logo-extra {
	display: flex;
	margin-top: 10upx;
}
.logo-extra button {
	width: 100%;
}

.logo {
	width: 100%;
	height: 240px;
	display: flex;
	justify-content: center;
	align-items: center;
}

image {
	width: 100px;
	height: 100px;
}
</style>