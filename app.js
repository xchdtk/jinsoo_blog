const express = require('express')
const app     = express()
const port    = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', express.static('assets'))
app.use('/login', express.static('assets/login.html'))
app.use('/create', express.static('assets/create.html'))
app.use('/detail', express.static('assets/detail.html'))
app.use('/written_update', express.static('assets/written_update.html'))
app.use('/comment_update', express.static('assets/comment_update.html'))

const writtenRouter = require('./routers/written')
const userRouter    = require('./routers/user')
app.use('/api', writtenRouter)
app.use('/user', userRouter)

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})

module.exports = app
