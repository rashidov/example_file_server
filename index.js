import express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'
import * as getFileType from 'file-type'
import fs from 'fs'
const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'./files')
  },
  filename: (req, file, cb) => {
    const { originalname } = file
    cb(null, originalname)
  }
})

const upload = multer({ storage: storage })

// принимаем файл
app.post('/up', upload.single('file'), (req, res) => {
  res.json({status: 'Saved'})
})

// отправляем файл
app.get('/file/:path', (req, res) => {
  const name = req.params.path 
  const path = `./files/${name}`

  fs.readFile(`./files/${name}`, async (err, buffer) => {
    // fileTypeFromFile - нужно указать путь до файла
    const type = await getFileType.fileTypeFromFile(path)
    res.setHeader('Content-Type', type.mime)
    res.send(buffer)
  })
})

app.listen(port, (req, res) => {
  console.log('server is started port => ', port)
})