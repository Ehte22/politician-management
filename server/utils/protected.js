const { User } = require("../models/User")

exports.protectedRoute = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, async (err, user, info) => {

        if (err) {
            return res.status(500).json({ message: "Internal Server Error", error: err.message });
        }

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid or missing token", info });
        }

        const loggedUser = await User.findById(user.userId).lean()

        if (loggedUser && loggedUser.sessionToken !== req.headers.authorization?.split(" ")[1]) {
            return res.status(401).json({ message: "Session has expired. Please log in again." });
        }

        req.user = user
        next()
    })(req, res, next)
};

exports.restrict = (role) => {
    return (req, res, next) => {
        const user = req.user
        if (!user || !role.includes(user.role)) {
            return res.status(403).json({ message: "You don't have permission to perform this action" })
        }
        next()
    }
}