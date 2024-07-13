import path from "path";
import { ExtractJwt, Strategy } from "passport-jwt"
import AuthDAO from "../services/authDAO.js";
import { User } from "@prisma/client";
import "dotenv/config.js";
import jsonwebtoken, { Algorithm } from "jsonwebtoken"

const publicKeyFilePath = path.join(process.cwd(), 'src', 'configs', 'id_rsa_pub.pem');
const privateKeyFilePath = path.join(process.cwd(), 'src', 'configs', 'id_rsa_priv.pem');

const PUB_KEY = process.env.PUB_KEY ?? ""; //fs.readFileSync(publicKeyFilePath, 'utf-8');
const PRIV_KEY = process.env.PRIV_KEY ?? ""; //fs.readFileSync(privateKeyFilePath, 'utf-8');

const options = {
    secretOrKey: PUB_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256'] as Algorithm[],
};

const strategy = new Strategy(options, async (payload: any, done: any) => {
    try {
        const user: User | null = await AuthDAO.getUser(payload.sub);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, null)   
    }
});

export const createJWT = (user: User): string => {
    const id = user.id;
    const JWTDuration = process.env.JWTDuration;
    const payload = {
        sub: id,
        iat: Date.now(),
    };
    const signedJWT = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: JWTDuration, algorithm: "RS256"});
    return "Bearer " + signedJWT;
}

export const createResetPasswordJWT = (user: User): string => {
    const id = user.id;
    const JWTDuration = '10m';
    const payload = {
        sub: id,
        iat: Date.now(),
    };
    const signedJWT = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: JWTDuration, algorithm: "RS256"});
    return signedJWT;
}

export const passportConfig = (passport: any) => {
    passport.use(strategy);
}