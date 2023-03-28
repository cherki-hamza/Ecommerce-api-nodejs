const path = require('path');
const fs = require('fs');
const ApiError = require('../utils/apiError');

/* 
const handelLangues = () => {
    console.log('hadel languages ..');
}

const seyHello = () => {
    console.log('hello from helper');
} */

// function for make directory if not existe
const mkdir = (folderName) => {
     let dir = path.join(__dirname, `../uploads/${folderName}`);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
}

// function for remove file 
const removeFile = (folderName,the_file) => {
    let file_dir = path.join(__dirname, `../uploads/${folderName}/${the_file}`);
    if (fs.existsSync(file_dir)) {
        fs.unlinkSync(file_dir);
    } else {
        return new ApiError(`Oops the file not found !!!`, 404);
    }    
}

module.exports = {/*  seyHello, handelLangues , */ mkdir , removeFile }