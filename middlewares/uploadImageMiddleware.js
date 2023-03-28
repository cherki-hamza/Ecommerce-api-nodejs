const multer  = require('multer');
const ApiError = require('../utils/apiError');


// method 1 for Memory storage Engine with image Buffer for upload image
exports.uploadSingleImage = (fieldName) => {

    // Memory storage Engine
    const multerMemoryStorage = multer.memoryStorage();

    // multer check the file is image
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new ApiError('Oops Only Images Allowed'), false);
        }
    };

    // multer Memory storage file destination
    const upload = multer({ storage: multerMemoryStorage, fileFilter: multerFilter });
    
    return upload.single(fieldName);
};


// method 1 for Memory storage Engine with image Buffer for upload mix of images
exports.uploadMixOfImages = (arrayOfFields) => {

    // Memory storage Engine
    const multerMemoryStorage = multer.memoryStorage();

    // multer check the file is image
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new ApiError('Oops Only Images Allowed'), false);
        }
    };

    // multer Memory storage file destination
    const upload = multer({ storage: multerMemoryStorage, fileFilter: multerFilter });

    return upload.fields(arrayOfFields);

};









// method 1 for DiskStorage engine ==> 
/* exports.uploadImageWithDiskStorageEngine = (fieldName) => {


// DiskStorage engine
 const multerDiskStorage = multer.diskStorage({
   destination: function(req,res,cb){
      cb(null,'uploads/categories');
   },
   filename: function(req,file,cb){
    const extention = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${extention}`;
    cb(null,filename);
   },
 });
    
// multer DiskStorage destination
    const upload = multer({ storage: multerDiskStorage, fileFilter: multerFilter });

    return upload.single(fieldName);

} */