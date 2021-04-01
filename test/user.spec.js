const request = require('supertest')
const app = require('../app')

jest.mock('../models')

const { User } = require('../models')

describe('회원가입 테스트', () => {
    test('닉네임은 3자미만 입력하므로써 닉네임을 3자이상 입력해주세요라는 메세지를 띄운다', async () => {
        const res = await request(app).post('/user/signup').send({
            nickname: 'xc',
            password: 'xwlstn12',
            confirm_password: 'xwlstn12',
            email: '1004kjs_@naver.com',
        })
        expect(res.status).toEqual(401)
    })

    test('패스워드에 닉네임이 포함되면 패스워드에 닉네임을 포함할 수 없습니다라는 메세지를 띄운다', async () => {
        const res = await request(app).post('/user/signup').send({
            nickname: 'xwlstn',
            password: 'xwlstn12',
            confirm_password: 'xwlstn12',
        })
        expect(res.status).toEqual(401)
        expect(res.body.errorMessage).toEqual(
            '패스워드에 닉네임을 포함할 수 없습니다.'
        )
    })

    test('패스워드가 4자미만이면 패스워드는 4자이상 입력해주세요라는 메세지를 띄운다', async () => {
        const res = await request(app).post('/user/signup').send({
            nickname: 'xwlstn',
            password: 'xwl',
            confirm_password: 'xwl',
        })
        expect(res.status).toEqual(401)
        expect(res.body.errorMessage).toEqual(
            '패스워드는 4자이상 입력해주세요.'
        )
    })

    test('닉네임은 대소문자와 숫자외에 문자를 입력하여 닉네임은 대소문자와 숫자로만 이루어져야 합니다라는 메세지를 띄운다', async () => {
        const res = await request(app).post('/user/signup').send({
            nickname: 'fd!!!!',
            password: 'xwlstn12',
            confirm_password: 'xwlstn12',
        })
        expect(res.status).toEqual(401)
        expect(res.body.errorMessage).toEqual(
            '닉네임은 대소문자와 숫자로만 이루어져야 합니다.'
        )
    })

    test('닉네임은 대소문자와 숫자외에 문자를 입력하여 닉네임은 대소문자와 숫자로만 이루어져야 합니다라는 메세지를 띄운다', async () => {
        const res = await request(app).post('/user/signup').send({
            nickname: '김진수',
            password: 'xwlstn12',
            confirm_password: 'xwlstn12',
        })
        expect(res.status).toEqual(401)
        expect(res.body.errorMessage).toEqual(
            '닉네임은 대소문자와 숫자로만 이루어져야 합니다.'
        )
    })

    test('패스워드와 패스워드확인란을 달리하여 패스워드가 패스워드 확인란과 다릅니다라는 메세지를 띄운다.', async () => {
        const res = await request(app).post('/user/signup').send({
            nickname: 'xchdtk',
            password: 'xwlstn',
            confirm_password: 'xwlstn12',
        })
        expect(res.status).toEqual(401)
        expect(res.body.errorMessage).toEqual(
            '패스워드가 패스워드 확인란과 다릅니다.'
        )
    })

    test('중복된 닉네임과 가능한 비밀번호를 입력하면 User.findOne이 실행된다', async () => {
        User.findOne = jest.fn()
        const res = await request(app).post('/user/signup').send({
            nickname: 'xchdtk',
            password: 'xwlstn12',
            confirm_password: 'xwlstn12',
        })
        expect(User.findOne).toHaveBeenCalledTimes(1)
    })

    test('가능한 닉네임과 패스워드를 입력하여 정상적으로 회원가입이 실행되어 회원가입에 성공하였습니다라는 메세지를 띄운다.', async () => {
        User.findOne = jest.fn()
        User.create  = jest.fn()
        const res    = await request(app).post('/user/signup').send({
            nickname: 'xchdtk',
            password: 'xwlstn12',
            confirm_password: 'xwlstn12',
        })
        
        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(User.create).toHaveBeenCalledTimes(1)
        expect(res.status).toEqual(201)
        expect(res.body.result).toEqual('회원가입에 성공하였습니다.')
    })
})