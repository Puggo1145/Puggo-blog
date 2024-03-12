import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        default: "https://source.unsplash.com/random/200x200?sig=4"
    }
}, { timestamps: true });

// 由于 Next 的 API 是 serverless 性质，因此每一次 API 调用都是一次新的连接行为，所以这里需要额外判断 User model 是否已经存在
// 这实际上是在遵循单例模式，确保每次调用都是同一个 User model
const User = models.User || model("User", userSchema);

export default User;