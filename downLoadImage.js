var fs = require('fs');
var path = require('path')
var request = require("request");
var AV = require('leancloud-storage');

// var APP_ID = 'E0NwAzBOGyaO8jI1yTbch1uR-gzGzoHsz';
// var APP_KEY = 'mGxPOqUDcMCctFx5S9FSe0ek';
//线上
var APP_ID = 'aea0rFkV8o1vKffkklEkeryV-gzGzoHsz';
var APP_KEY = 'oSVHjcWrt94jYDyGg24UwKOt';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
const dir = './全部图片'
imageDir = './全部图片'

let idList = fs.readdirSync(imageDir).map(filename => {
        return path.basename(filename, '.jpg');
})

console.log(idList.length)
async function downLoad() {
    var query = new AV.Query('TaskList');

    let count = await query.count()
    console.log(count)
    for(let i = 0;i < count;i++){
        console.log(i)
       await downItemImage(query,i)
    }
}

function downItemImage(query,i){
    return new Promise(resolve => {
        query.limit(1).notContainedIn('objectId', idList).find()
            .then(data => {
                if(data[0].attributes.taskFileId){
                    idList.push(data[0].id)
                    let imageName = data[0].id
                    let src = data[0].attributes.taskFileId.attributes.url
                    let imageType = '.jpg'
                    const imageDir = `${dir}/${imageName}${imageType}`
                    var writeStream = fs.createWriteStream(imageDir);
                    var readStream = request(src)
                    readStream.pipe(writeStream);
                    readStream.on('end', function() {
                        console.log(`文件${i}下载成功`);
                    });
                    readStream.on('error', function() {
                        console.log(`${imageName}${i}`)
                        resolve('ok')
                    })
                    writeStream.on("finish", function() {
                        console.log(`文件${i}写入成功`);
                        writeStream.end();
                        resolve('ok')
                    });
                }else{
                    idList.push(data[0].id)
                    resolve('ok')
                }
            })
    })
}

downLoad();
