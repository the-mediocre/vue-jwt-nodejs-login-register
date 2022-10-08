<template>
  <div>
    <div>注册页面</div>
    <div>
      <span>账号</span> <input type="text" v-model="username">
    </div>
    <div>
      <span>密码</span> <input type="text" v-model="password">
    </div>
    <button @click="register">注册</button>
    <button @click="toLogin">登录页面</button>
  </div>
</template>

<script>
import request from '../api';

export default {
  name: 'TheRegister',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    register() {
      const userInfo = {
        username: this.username,
        password: this.password
      }
      request.post('/register', JSON.stringify(userInfo)).then((r) => {
        console.log(r.data)
      })
    },
    toLogin() {
      this.$router.push('./login')
    }
  },
}
</script>

<style>

</style>