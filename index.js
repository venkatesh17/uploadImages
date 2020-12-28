const express = require('express');
const bodyparser = require('body-parser')
const path = require('path')
const multer = require('multer')
const ejs = require('ejs')

//Access env variable
const dotenv = require('dotenv');
dotenv.config();

const app = express()

//set engin
app.set('view engine', 'ejs')

//using json
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

//set static directory
app.use('/public', express.static(path.join(__dirname+'public')))

//basic route
app.get('/', function(req,res){
    res.status(200).render('index', {msg:''})
})

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename : function(req, file, cb){
        cb(null, file.originalname.split('.')[0]+"-"+Date.now()+path.extname(file.originalname))
    }
})
const upload = multer({
    storage : storage,
    limits : { fileSize:10000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('myImage')// single image upload
 //.array('myImage',10) multiple images uploaded

// const uploadFile = upload.array("images", 2) 

function checkFileType(file, cb){
    // allowed extension
    const filetypes = /jpeg|jpg|png|gif|svg/

    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())

    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true)
    }
    else{
        cb('Error : Images only!')
    }
}


//file upload
app.post('/api/upload', function(req,res){
    upload(req,res, function(err){
    //    uploadFile(req, res, function(err){
        if(err){
            res.render('index', err)
        }else{
            if(req.files==undefined){
                res.render('index', {msg:'error : no file selected'})
            }else{
              
                res.render('index', {
                    msg:'file uploaded',
                    file:`uploads/${req.file.filename}` //${req.files.filename} multiple images
                })
            }
        }
    })
})



const PORT = process.env.PORT || 3000
app.listen(PORT, function(res,err){
    console.log(`App running at port ${PORT}`);
})






