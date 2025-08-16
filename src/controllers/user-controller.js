import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) =>{
    // get user details from fronted
    // validation- not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary(cloudinary pe images upload hone ka baad check karnege), avtar check karenge multer ki help se hua hai ki nahi
    // create user object - create entry in db
    // remove password and refresh token field from response, then send response to the fronted
    // check for user creation
    // reutrn response


    // get user details from fronted
    const { fullName, email, username, password } = req.body;
    console.log("email: ", email, password);

    // validation- not empty
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exists: username, email
    const exitedUser = User.findOne({
        $or: [ { username }, { email }]
    });

    if (exitedUser) {
        throw new ApiError(409, "User with email or username already exits")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }


    // upload them to cloudinary(cloudinary pe images upload hone ka baad check karnege), avtar check karenge multer ki help se hua hai ki nahi
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Avatar upload failed");
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // remove password and refresh token field from response, then send response to the fronted
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went through while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export { registerUser, }