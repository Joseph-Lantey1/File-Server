import passport from "passport";
import { ExtractJwt, Strategy } from 'passport-Jwt';
import db from "../connection/database";


// Configuration options for JWT authentication
const options = {
    secretOrKey: "jbl", //secret key
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

// Passport JWT strategy configuration
passport.use(
    new Strategy(options, async ({ id }, done) => {
        try {
            const { rows } = await db.query("SELECT id, email FROM users WHERE id = $1", [id]);

            // If no user is found with the given id, return 'false' with a message
            if (!rows.length) {
                return done(null, false, { message: "No user found" });
            }

            // Create a user object with id and email properties
            const user = { id: rows[0].id, email: rows[0].email };

            // Return the user object
            return done(null, user);
        } catch (error) {
            // If an error occurs, return 'false' with an error message
            return done(null, false, { message: "An error occurred" });
        }
    })
);