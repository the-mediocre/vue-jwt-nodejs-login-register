<template>
  <div>
    <div>登录页面</div>
    <div>
      <span>账号</span> <input type="text" v-model="username">
    </div>
    <div>
      <span>密码</span> <input type="text" v-model="password">
    </div>
    <button @click="login">点击</button>
    <button @click="toRegister">注册页面</button>
  </div>
</template>

<script>
import request from '../api';
export default {
  name: 'TheLogin',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      const userInfo = {
        username: this.username,
        password: this.password
      }
      request.post('/login', JSON.stringify(userInfo)).then((r) => {
        if (r.data.status === 0) {
          localStorage.removeItem('token')
          console.log('localStorage fail,try again')
          return
        }
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token')
        }
        localStorage.setItem('token', r.data.tokenStr)
        this.$router.push('/hello')
      })
    },
    toRegister() {
      this.$router.push('./register')
    }
  },
}
</script>

<style>

</style>