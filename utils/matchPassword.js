import bcrypt from "bcryptjs";
const matchPassword = async (password, userPassword) => {
    return bcrypt.compare(password, userPassword);
};
export default matchPassword;