let showProfile = async (req, res) => {
    try {
        return res.status(200).json({
            "User": req.user,
            "message": "Profile Section"
        })
    } catch (error) {
        return res.status(400).send(error);
    }
}

export { showProfile };