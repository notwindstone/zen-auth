import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { defaultSession, sessionOptions } from "@/lib/sessions";
import { sleep, SessionData } from "@/lib/sessions";

export async function POST(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    const { username = "No username" } = (await request.json()) as {
        username: string;
    };

    session.isLoggedIn = true;
    session.username = username;
    await session.save();

    await sleep(250);

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