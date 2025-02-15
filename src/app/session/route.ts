import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { defaultSession, sessionOptions } from "@/lib/sessions";
import { SessionData } from "@/lib/sessions";
import { v4 as generateUUID } from 'uuid';
import {createUser} from "@/queries/insert";
import bcrypt from 'bcrypt';
import {updateSessionId} from "@/queries/update";
import {getHashedPassword, getSessionId} from "@/queries/select";
import {UserData} from "@/types/UserData.type";

export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    const {
        username = "No username",
        email = "No email",
        password = "No password",
        isSignIn = false,
    } = (await request.json()) as UserData;

    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";

    if (isSignIn) {
        const foundSessionId = (await getSessionId(email))?.[0]?.sessionId;

        if (foundSessionId === sessionId) {
            session.isLoggedIn = true;
            session.username = username;
            session.email = email;

            await session.save();

            return Response.json(session);
        }

        const { hashedPassword } = (await getHashedPassword(email))?.[0];

        const isPasswordEqual = await bcrypt.compare(password, hashedPassword);

        if (isPasswordEqual) {
            session.isLoggedIn = true;
            session.username = username;
            session.email = email;

            await session.save();

            const newSessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";
console.log(`NEW---SESSION ${newSessionId}`);
            await updateSessionId(email, { sessionId: newSessionId });

            return Response.json(session);
        }

        return Response.json(defaultSession);
    }

    const userUUID = generateUUID();
    const saltRounds = 10;

    let hashedPassword: string;
    let saltedPassword: string;

    bcrypt.genSalt(saltRounds, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                return Response.error();
            }

            hashedPassword = hash;
            saltedPassword = salt;
console.log("SIGN UP", sessionId)
            await createUser({
                uuid: userUUID,
                name: username,
                email: email,
                password: hashedPassword,
                salt: saltedPassword,
                sessionId: sessionId,
            });
        });
    });

    session.isLoggedIn = true;
    session.username = username;
    session.email = email;

    await session.save();

    return Response.json(session);
}

export async function GET() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn) {
        return Response.json(defaultSession);
    }

    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";
    const foundSessionId = (await getSessionId(session.email))?.[0]?.sessionId;
console.log(foundSessionId, sessionId, foundSessionId === sessionId)
    if (foundSessionId !== sessionId) {
        return Response.json(defaultSession);
    }

    return Response.json(session);
}

export async function DELETE() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";

    await updateSessionId(session.email, { sessionId: "" });
    session.destroy();

    return Response.json(defaultSession);
}