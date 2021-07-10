exports.checkPass = (req, res, user,bcrypt) => {
    return new Promise((resolve,reject) => {
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        resolve(passwordIsValid);
    })
}
    

   



