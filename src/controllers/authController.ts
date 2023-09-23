import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "../connection/database";
import { AuthenticationError } from "../middlewares/errorHandlingMiddleware";

interface Request {
    headers: any;
    user?: any; // Define the type of user property as needed
}

// Define an interface for your token payload
interface MyJwtPayload extends JwtPayload {
    userId: number; // Change the type to match your userId data type
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Read token and check if it exists
    const testToken = req.headers.authorization;
    let token: string | undefined;

    if (testToken) {
        token = testToken;
    }

    if (!token) {
        throw new AuthenticationError("You are not allowed to access this page"); // Return early to avoid further execution
    }

    try {
        // 2. Validate the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string) as MyJwtPayload;

        // 3. Check if user exists
        const userId = decodedToken.userId; // No need for "await" here

        const existingUser = await db.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (!existingUser.rows.length) {
            const error = new Error("User with the given token does not exist");
            return next(error);
        }

        req.user = existingUser.rows[0]; // Assign the user to req.user

        // 5. Allow the user to access the route
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        next(new Error("Authentication failed"));
    }
};
