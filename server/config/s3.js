require('dotenv').config()
const { S3 } = require("aws-sdk");
const fs = require('fs')



const s3=new S3({
    region:process.env.AWS_BUCKET_REGION,
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY
})
//upload a file to s3
function uploadFile(filename)
{

    const uploadParams = {
        Bucket:process.env.AWS_BUCKET_NAME,
        Body:filename,
        Key:filename
    }
    s3.upload(uploadParams,function (err)
    {
        console.log(err)
    })
}
exports.uploadFile=uploadFile
//download a file from s