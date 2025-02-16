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
import {LOGIN_ERRORS} from "@/configs/constants";

export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    const {
        username = "",
        email = "",
        password = "",
        isSignIn = false,
    } = (await request.json()) as UserData;

    if (isSignIn) {
        const fetchedData = (await getSessionId(email))?.[0];
        const foundName = fetchedData?.name;

        const { hashedPassword } = (await getHashedPassword(email))?.[0];
        const isPasswordEqual = await bcrypt.compare(password, hashedPassword);

        if (isPasswordEqual) {
            session.isLoggedIn = true;
            session.username = foundName;
            session.email = email;

            await session.save();

            const newSessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";

            await updateSessionId(email, { sessionId: newSessionId });

            return Response.json({
                ...session,
                password: undefined,
                username: foundName,
            });
        }

        return Response.json({
            ...defaultSession,
            error: LOGIN_ERRORS.INCORRECT_PASSWORD,
        });
    }

    const userUUID = generateUUID();
    const saltRounds = 10;

    let hashedPassword: string;
    let saltedPassword: string;

    bcrypt.genSalt(saltRounds, async (_err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                return Response.error();
            }

            hashedPassword = hash;
            saltedPassword = salt;

            session.isLoggedIn = true;
            session.username = username;
            session.email = email;

            await session.save();

            const newSessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";

            await createUser({
                uuid: userUUID,
                name: username,
                email: email,
                password: hashedPassword,
                salt: saltedPassword,
                sessionId: newSessionId,
            });
        });
    });

    return Response.json({
        ...session,
        password: undefined,
        username: username,
    });
}

export async function GET() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn) {
        return Response.json(defaultSession);
    }

    const sessionId = (await cookies()).get("authless-next-cookies-key-name")?.value ?? "";
    const fetchedData = (await getSessionId(session.email))?.[0];
    const foundSessionId = fetchedData?.sessionId;
    const foundName = fetchedData?.name;

    if (foundSessionId !== sessionId) {
        return Response.json(defaultSession);
    }

    return Response.json({
        ...session,
        password: undefined,
        username: foundName,
    });
}

export async function DELETE() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    await updateSessionId(session.email, { sessionId: "" });
    session.destroy();

    return Response.json(defaultSession);
}