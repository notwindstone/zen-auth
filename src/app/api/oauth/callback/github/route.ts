import { NextRequest, userAgent } from "next/server";
import * as arctic from "arctic";
import { cookies } from "next/headers";
import {
    OAUTH2_API_ROUTES,
    OAUTH2_BAD_REQUEST_PARAMS,
    OAUTH2_REDIRECT_ERROR_URL_PARAMS,
    OAUTH2_INTERNAL_SERVER_ERROR_PARAMS,
    OAUTH2_ERROR_BASE_PARAMS,
    OAUTH2_USER_EXISTS_PARAMS,
} from "@/configs/api";
import { redirect } from "next/navigation";
import { PAGE_ROUTES } from "@/configs/pages";
import { checkUserExistence, createUser } from "@/lib/actions/user";
import { types } from "node:util";
import { GithubUserResponseType } from "@/types/OAuth2/Responses/GithubUserResponse.type";
import { v4 as uuid } from "uuid";
import { generateSecurePassword } from "@/utils/secure/generateSecurePassword";
import { generateSessionToken } from "@/utils/secure/generateSessionToken";
import { createSession } from "@/lib/actions/session";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { setSessionTokenCookie } from "@/lib/actions/cookies";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";

export async function GET(request: NextRequest): Promise<Response> {
    let tokens;
    let accessToken;

    const cookieStore = await cookies();
    const github = new arctic.GitHub(
        process.env.GITHUB_CLIENT_ID!,
        process.env.GITHUB_SECRET_KEY!,
        null,
    );
    const code = request.nextUrl.searchParams.get("code") as string;
    const state = request.nextUrl.searchParams.get("state") as string;
    const storedState = cookieStore.get('state')?.value as string;
    const errorUrl = cookieStore.get(OAUTH2_REDIRECT_ERROR_URL_PARAMS)?.value as string;

    if (code === null || storedState === null || state !== storedState) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_BAD_REQUEST_PARAMS}`);
    }

    try {
        tokens = await github.validateAuthorizationCode(code);
        accessToken = tokens.accessToken();
    } catch (e) {
        console.error(e);

        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`);
    }

    const response = await fetch(OAUTH2_API_ROUTES.GITHUB.USER, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    let user: GithubUserResponseType;

    try {
        user = await response.json();
    } catch (e) {
        console.error(e);

        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`);
    }

    const username = user?.login;
    const email = user?.email;
    const userId = `${request.nextUrl.pathname}_${user?.id ?? uuid()}`;

    const userExistence = await checkUserExistence({
        username,
        email,
    });

    if (types.isNativeError(userExistence)) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`);
    }

    if (userExistence !== null && userExistence.email) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_USER_EXISTS_PARAMS}`);
    }

    let newUsername;

    if (userExistence !== null && userExistence?.username) {
        newUsername = uuid();
    } else {
        newUsername = username;
    }

    const secureAccessTokenResponse = await generateSecurePassword({
        password: accessToken,
    });

    if (types.isNativeError(secureAccessTokenResponse)) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`);
    }

    const { hash } = secureAccessTokenResponse;

    const userDatabaseResponse = await createUser({
        id: userId,
        username: newUsername,
        displayName: newUsername,
        email,
        password: hash,
    });

    if (types.isNativeError(userDatabaseResponse)) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`);
    }

    const {
        cpu,
        os,
        browser,
    } = userAgent(request);
    const ipAddress = getIpAddress(request);

    // sessionToken is NOT a sessionId
    const sessionToken = generateSessionToken();
    const sessionResponse = await createSession({
        token: sessionToken,
        userId: userId,
        architecture: cpu?.architecture ?? "unknown",
        os: `${os?.name} ${os?.version}`,
        browser: `${browser?.name} ${browser?.version}`,
        ipAddress: ipAddress,
    });

    if (types.isNativeError(sessionResponse)) {
        return redirect(errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`);
    }

    await setSessionTokenCookie({
        token: sessionToken,
        expiresAt: getMonthForwardDate(),
    });

    return redirect(PAGE_ROUTES.PROFILE.ROOT);
}