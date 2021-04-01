const express = require('express')

const { Written, Comment, User } = require('../models')
const router = express.Router()
const middleware = require('../middlewares/auth-middleware')


router.get('/written', async (req, res) => {
    try {
        nickname      = []
        comments      = []
        comment_count = []
        writtens      = await Written.findAll({
            // order : [["createdAt desc"]]
        })

        for (let written of writtens) {
            user    = await User.findOne({
                where : {userId : written.userId}
            })
            comment = await Comment.findAll({
                where : {writtenId : written.writtenId}
            })
            
            nickname.push(user.nickname)
            comments.push(comment)
        }
   
        for (let index in comments) {
            comment_count.push(comments[index].length)
        }
        console.log(comment_count)
        res.status(200).json({ written: writtens, nickname : nickname, count : comment_count })

    } catch (err) {
        console.error(err)
    }
})

router.get('/written/:writtenId', async (req, res) => {
    const { writtenId } = req.params

    written = await Written.findOne({
        where: { writtenId },
    })
    res.status(200).json({ detail: written })
})

router.post('/written', middleware, async (req, res) => {
    try {
        const { title, image_url, description } = req.body
        const { userId } = res.locals.user

        await Written.create({ title, image_url, description, userId })
        res.status(201).send({ result: 'success' })

    } catch (err) {
        console.error(err)
    }
})

router.delete('/written', middleware, async (req, res) => {
    try {
        const writtenId = req.body.id
        written = await Written.findOne({
            where: { writtenId },
        })
        if (written.userId == res.locals.user.userId) {
            const written = await Written.destroy({
                where: { writtenId: req.body.id },
            })

            res.status(201).send({ result: '삭제되었습니다' })
            return
        } else {
            res.status(200).send({
                result: '본인 게시물만 삭제할 수 있습니다.',
            })
        }
    } catch (err) {
        console.error(err)
    }
})

router.get('/update/:writtenId', async (req, res) => {
    try {
        written = await Written.findOne({
            where: { writtenId: req.params.writtenId },
        })
        res.status(200).send({ written: written })
    } catch (err) {
        console.error(err)
    }
})

router.put('/update', middleware, async (req, res) => {
    try {
        const { writtenId, title, image_url, description } = req.body

        if (written.userId == res.locals.user.userId) {
            await Written.update(
                {
                    title: title,
                    image_url: image_url,
                    description: description,
                },
                { where: { writtenId } }
            )

            res.status(200).send({ result: '수정완료' })
            return
        } else {
            res.status(401).send({
                result: '본인 게시물만 수정할 수 있습니다.',
            })
        }
    } catch (err) {
        console.log(err)
    }
})

router.put('/comment', middleware, async (req, res) => {
    try {
        const { commentId, comment } = req.body
        const comment_info = await Comment.findOne({
            where: { commentId },
        })

        if (comment_info.userId != res.locals.user.userId) {
            res.status(401).send({
                result: '본인 게시물만 수정할 수 있습니다.',
            })
        } else {
            if (comment.length < 5) {
                res.status(400).send({ result: '댓글을 5자이상 입력해주세요' })
                return
            }
            Comment.update(
                { comment: comment },
                { where: { commentId: commentId } }
            )
            res.status(200).send({ result: '수정완료' })
            return
        }
    } catch (err) {
        console.log(err)
    }
})

router.post('/comment/:writtenId', middleware, async (req, res) => {
    try {
        const { comment } = req.body
        const { writtenId } = req.params
        const { userId } = res.locals.user
        await Comment.create({ writtenId, comment, userId })
        res.status(200).send({ result: '댓글 생성 완료' })
    } catch (err) {
        console.log(err)
    }
})

router.get('/comment/:writtenId', async (req, res) => {
    try {
        nickname = []
        comments = await Comment.findAll({
            where: { writtenId: req.params.writtenId },
        })
        
        for (let comment of comments) {
            user = await User.findOne({
                where : {userId : comment.userId}
            })
            nickname.push(user.nickname)
        }
        res.send({ comment: comments, nickname : nickname})
    } catch (err) {
        console.log(err)
    }
})

router.get('/update/comment/:commentId', async (req, res) => {
    try {
        comment = await Comment.findOne({
            where: { commentId: req.params.commentId },
        })

        res.send({ result: comment })
    } catch (err) {
        console.log(err)
    }
})

router.delete('/update/comment', middleware, async (req, res) => {
    try {
        const { commentId } = req.body

        comment_info = await Comment.findOne({
            where: { commentId: commentId },
        })

        if (comment_info.userId == res.locals.user.userId) {
            await Comment.destroy({
                where: { commentId: commentId },
            })
            res.status(201).send({ result: '삭제되었습니다' })
            return
        } else {
            res.status(200).send({
                result: '본인 게시물만 삭제할 수 있습니다.',
            })
        }
    } catch (err) {
        console.error(err)
    }
})

module.exports = router
