export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const User = await user.findOne({ email });
    if (!User) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
        { id: User._id, isAdmin: User.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,           // ✅ important for Render + Vercel (HTTPS)
        sameSite: "None",       // ✅ required for cross-origin cookies
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        token,
        user: {
            id: User._id,
            name: User.name,
            email: User.email,
            isAdmin: User.isAdmin,
        },
    });
};
