/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a handler factory to refactor repeat code in the app
*/

const asyncHandler = require('express-async-handler');
const ApiError = require('../../utils/apiError');
const ApiFeatures = require('../../utils/apiFeatures');
const fs = require('fs');
const path = require('path');
const { removeFile } = require('../../helpers/helper');

// handler for delete one doc
exports.deleteOne = (Model,folderName='') => asyncHandler(async (req, res, next) => {

    let document;
    //const id = req.params.id or
    const id = req.params.id;
    //const document = await Model.findByIdAndDelete(id);
    document = await Model.findById(id);
    
    // remove image from upload/../..name.png 
    if (document.image) {
        removeFile(folderName,document.image);
        document.delete();
    }

    // remove user profile by image
    if (document.profileImg) {
        removeFile(folderName,document.profileImg);
        document.delete();
    }

    // remove images and cover image
    if (document.imageCover) {

          removeFile(folderName, document.imageCover);
        
          if (document.images) {
              
                let the_images = [];
                if (Array.isArray(document.images)) {
                    
                    the_images = document.images;
                    the_images.forEach((img) => {
                        removeFile(folderName, img);
                    });

                }
              
          }

        document.delete();
    }

    

    if (!document) {
        return next(new ApiError(`Oops No Document for this id ${id} `, 404));

    }
    // delete the image of document from aploads
    
    res.status(200).json({ message: `The document  deleted with success` });

});

// handler for update one doc
exports.updateOne = (Model,folderName='') => asyncHandler(async (req, res, next) => {
   
    let document;
    const id = req.params.id;
    const get_image = await Model.findById(id);
    
    
    // remove image from upload/categories/..name.png 
    if(req.body.image) {
        
        removeFile(folderName, get_image.image);
         document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return by new brand name update
        );

    } else {
         // update without any image
        document = await Model.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true } // return by new brand name update
        ); // end update without any image
    }


    // remove imageCover from upload/products/..name.png 
    if(req.body.imageCover) {
        
        removeFile(folderName, get_image.imageCover);
        document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return by new brand name update
        );
        
    }

    // remove array of  images from upload/products/..Arrat_of_Images__name.png 
    if (req.body.images) {
        let the_images = [];
        if (Array.isArray(get_image.images)) {
            
            the_images = get_image.images;
            the_images.forEach((img) => {
                removeFile(folderName, img);
            });

            document = await Model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true } // return by new brand name update
            );

        }
           
    } // end remove array of images ******************************************//

    // remove image from upload/../..name.png  and update
    if (req.body.profileImg) {
        
        removeFile(folderName, get_image.profileImg);
         document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return by new brand name update
        );

    } // end remove image from upload/../..name.png  and update

   

    if (!document) {
        return next(new ApiError(`Oops The document by id  ${id} not be updated`, 404));
    }
    res.status(200).json({ /* result:'The image updated with success' , */ data: document });

});

// handler for create one document
exports.createOne = (Model) => asyncHandler(async (req, res) => {

    const document = await Model.create(req.body);
    res.status(201).json({ data: document });

});

// handler for get one document
exports.getOne = (Model) => asyncHandler(async (req, res, next) => {

    //const id = req.params.id or
    const id = req.params.id;
    const document = await Model.findById(id);

    if (!document) {
        return next(new ApiError(`Oops No document for this id ${id} `, 404));
    }
    res.status(200).json({ data: document });

});

// handler for get all documents
exports.getAll = (Model , modelName = '') => 
    asyncHandler(async (req, res) => {

    // check subcategory filter
    let filter = {};

    if(req.filterObJ){
        filter = req.filterObJ;
    }

    //3  build query
    const documentsCount = await Model.countDocuments();
    const api_features = new ApiFeatures(Model.find(filter),req.query)
                                        .paginate(documentsCount).filter().search(modelName)
                                        .limitFields().sort();
                                        /* .populate({path:'category',select:'name'})
                                        .populate({path:'subcategory',select:'name'}); */

    // execute query
    const {mongooseQuery , paginationResult} = api_features;                                   
    const documents = await api_features.mongooseQuery;  

    res.status(201).json({ result: documents.length, paginationResult, data: documents });
    
});
