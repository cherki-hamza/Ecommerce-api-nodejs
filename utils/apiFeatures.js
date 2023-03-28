/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is a class apiFeatures for many features in the app like sorting serching ..
*/

class ApiFeatures{

    constructor(mongooseQuery,queryString){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    // method filter
    filter(){
        // remove the reserved props in query requests 
        const queryStringObj = {...this.queryString};
        const excludesFields = ["page","sort","limit","fields"];
        excludesFields.forEach((field)=> delete  queryStringObj[field]);

        // Apply filtration using [gte,gt,lte,lt]
        // {price: {$gte: 50} , ratingAverage: {$gte: 4} }
        // link example ==> http://localhost:8000/api/v1/products?ratingAverage[lte]=4&price[gte]=100
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);  //g: git all repeated gte or gt or lte or lt without skiping

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

        return this;
    }// end filter

    // method sorting
    sort(){
        if(this.queryString.sort){
            // example : price, -sold ==> [price, -sold] ==> price -sold
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }else{
            this.mongooseQuery = this.mongooseQuery.sort('-createAt');
        }

        return this;
    }// end sorting

    // method limit fields
    limitFields(){
        if(this.queryString.fields){
            // example1 : http://localhost:8000/api/v1/products?fields=title,price,imageCover,sold
            // example1 : http://localhost:8000/api/v1/products?fields=-title,-sold
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }else{
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }

        return this;
    }// end limit fields

    // method search
    search(modelName){
        if(this.queryString.keyword){
            // example1 : http://localhost:8000/api/v1/products?keyword=men or women or any text...
            // example 2 http://localhost:8000/api/v1/products?keyword=slightly&fields=title,price
           let query = {};
           if(modelName === 'Products'){
            query.$or = [
                {title: {$regex: this.queryString.keyword, $options: "i"} }, // i ==> for lowercase and upercase 
                {description: {$regex: this.queryString.keyword, $options: "i"} },
           ];
           }else{
              query = {name: {$regex: this.queryString.keyword, $options: "i"} };
           }

           this.mongooseQuery = this.mongooseQuery.find(query);
       }

       return this;
    }// end search

    // method pâginate
    paginate(countDocument){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.page * 1 || 50;
        const skip = ((page - 1) * limit);
        //
        const endIndex = page * limit;
        //pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = (Math.ceil(countDocument / limit));

        // next page
        if(endIndex < countDocument){
            pagination.next = page + 1;
        }

        if(skip > 0){
            pagination.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;

        return this;
    }// end paginate


}// end ApiFeatures class

module.exports = ApiFeatures;