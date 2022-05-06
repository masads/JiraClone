// require('dotenv').config()
// const { S3 } = require("aws-sdk");
// const fs = require('fs')



// const s3=new S3({
//     region:process.env.AWS_BUCKET_REGION,
//     accessKeyId:process.env.AWS_ACCESS_KEY,
//     secretAccessKey:process.env.AWS_SECRET_KEY
// })
// //upload a file to s3
// function uploadFile(file)
// {
//     const fileStream = fs.createReadStream("./images/1798d246fb5d095333c8882aba46b976")
//     const uploadParams = {
//         Bucket:process.env.AWS_BUCKET_NAME,
//         Body:fileStream,
//         Key:`test.png`
//     }
//     s3.upload(uploadParams,function (err)
//     {
//         console.log(err)
//     })
// }
// exports.uploadFile=uploadFile
// //download a file from s