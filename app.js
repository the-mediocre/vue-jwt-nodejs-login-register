const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

//加密密码  
const bcrypt = require('bcryptjs')
//jwt
const jwt = require('jsonwebtoken')
const secretKey = 'this is token'
const expiresIn = 60 * 60 * 24 * 30
//生成jwt
function generateToken(data, expiresIn) {
  return jwt.sign({ data }, secretKey, { expiresIn })
}
//解析jwt
function verifyToken(token) {//验证token是否合法的方法

  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        reject(err.message)
      } else {
        resolve(data)
      }
    })
  })
}

//数据库
const mysql = require('mysql')
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '276274llh',
  database: "my_db_01"  //数据库名
})




app.use(express.json())
app.use(cors())

//判断是否携带jwt//并进行解析
app.use((req, res, next) => {
  const tokenStr = req.headers.authorization
  if (tokenStr) {
    verifyToken(tokenStr).then(
      v => { console.log(v); next() },
      r => {
        console.log(r)
        return res.send({ status: 0, data: r })
      }
    )
  } else {
    next()
  }

})

//登录
app.post('/login', function (req, res) {
  const userInfo = req.body
  const sqlStr1 = 'select * from users where username=?'
  db.query(sqlStr1, userInfo.username, (err, result) => {
    if (err) {
      return res.send(err.message)
    }
    if (result.length) {
      // 拿着用户输入的密码,和数据库中存储的密码进行对比
      const compareResult = bcrypt.compareSync(userInfo.password, result[0].password)
      if (compareResult) {
        //登录成功//jwt
        const tokenStr = generateToken(userInfo.username, expiresIn)
        return res.send({ status: 1, tokenStr })
      } else {
        return res.send('登录失败，检查密码')
      }
    }
  })
})





//注册
app.post('/register', function (req, res) {
  const userInfo = req.body
  //是否为空
  if (!userInfo.username || !userInfo.password) {
    return res.send('账号或密码不能为空')
  }
  //账号是否存在
  const sqlStr1 = 'select * from users where username=?'
  db.query(sqlStr1, userInfo.username, (err, result) => {
    if (err) {
      return res.send(err.message)

    }
    if (result.length) {
      return res.send('账号已存在')

    }
    //插入新用户
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    const sqlStr2 = 'insert into users set ?'
    db.query(sqlStr2, userInfo, (err, result) => {
      if (err) {
        return res.send(err.message)
      }
      if (result.affectedRows !== 1) {
        return res.send('注册失败，稍后再试')
      }
      return res.send('注册成功')

    })
  })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))