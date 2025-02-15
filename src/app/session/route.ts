import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { defaultSession, sessionOptions } from "@/lib/sessions";
import { sleep, SessionData } from "@/lib/sessions";
import { v4 as generateUUID } from 'uuid';
import {createUser} from "@/queries/insert";
import { bcrypt } from 'bcrypt';

export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    const {
        username = "No username",
        email = "No email",
        password = "No password",
    } = (await request.json()) as {
        username: string;
        email: string;
        password: string;
    };

    session.isLoggedIn = true;
    session.username = username;
    session.email = email;

    await session.save();

    const userUUID = generateUUID();

    await createUser({
        uuid: userUUID,
        name: username,
        email: email,
        password: password,
        sessionId: "",
    });

    return Response.json(session);
}

export async function GET() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    await sleep(250);

    if (!session.isLoggedIn) {
        return Response.json(defaultSession);
    }

    return Response.json(session);
}

export async function DELETE() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    session.destroy();

    return Response.json(defaultSession);
}