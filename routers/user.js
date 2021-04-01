const express    = require('express')
const jwt        = require('jsonwebtoken')
const secret     = require('../secret')
const { User }   = require('../models/')
const router     = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const { nickname, password, confirm_password } = req.body
     
        if (password.includes(nickname)) {
            res.status(401).send({
                errorMessage: '패스워드에 닉네임을 포함할 수 없습니다.',
            })
            return
        }

        if (password.length < 4) {
            res.status(401).send({
                errorMessage: '패스워드는 4자이상 입력해주세요.',
            })
            return
        }
        if (!/^[a-z0-9_]*$/.test(nickname)) {
            res.status(401).send({
                errorMessage: '닉네임은 대소문자와 숫자로만 이루어져야 합니다.',
            })
            return
        }

        if (nickname.length < 3) {
            res.status(401).send({
                errorMessage: '닉네임을 3자이상 입력해주세요.',
            })
            return
        }

        if (password != confirm_password) {
            res.status(401).send({
                errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
            })
            return
        }

        const existsUsers = await User.findOne({
            where: { nickname },
        })

        if (existsUsers) {
            res.status(401).send({
                errorMessage: '닉네임이 중복됐습니다.',
            })
            return
        }

        await User.create({ nickname: nickname, password: password })

        res.status(201).send({
            result: '회원가입에 성공하였습니다.',
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { nickname, password } = req.body

        const user = await User.findOne({
            where: { nickname },
        })

        if (!user || password !== user.password) {
            res.status(401).send({
                errorMessage: '이메일 또는 패스워드가 틀렸습니다.',
            })
            return
        }

        token = jwt.sign({ userId: user.userId }, secret)
        res.status(201).send({
            token: token,
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
