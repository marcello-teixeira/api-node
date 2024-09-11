import jwt from 'jsonwebtoken';


export function checkToken(req, res, next) {

    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(" ")[1];

    const secret = process.env.secret_token;

    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
            res.status(401).json({msg: "Token invalid"})
        } else {
            next();
        }
    });

}


export function getClaims(req) {
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(" ")[1];

    const secret = process.env.secret_token;
    const claims = jwt.verify(token, secret);

    return claims;
}