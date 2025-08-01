// Method -1 
// const asyncHandler = (requestHandler) => async (req,res,next) =>{
//     try {
//         await requestHandler(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//              success: false,
//              message: error.message
//         });
//     }
// }


// Method -2
const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    }
}

export { asyncHandler }