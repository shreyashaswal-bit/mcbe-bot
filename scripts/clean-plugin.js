const fs = require("fs");
const path = require("path");

const dirName = "./plugins";

//.filter((file_name)=>path.extname(file_name)===".js")
// fileList =

const FileList = fs.readdirSync(dirName);
const deleteFileList = [];

for (let file_name of FileList) {
    if (path.extname(file_name).toLowerCase() == ".ts") {
        const jsFileName = path.basename(file_name, ".ts") + ".js";
        if (FileList.includes(jsFileName)) {
            fs.unlinkSync(path.join(dirName, jsFileName));
        }
    }
}
