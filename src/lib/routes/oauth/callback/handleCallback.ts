"use server";

import { cookies } from "next/headers";
import {
    OAUTH2_BAD_REQUEST_PARAMS,
    OAUTH2_ERROR_BASE_PARAMS,
    OAUTH2_INTERNAL_SERVER_ERROR_PARAMS,
    OAUTH2_REDIRECT_ERROR_URL_PARAMS, OAUTH2_USER_EXISTS_PARAMS,
} from "@/configs/api";
import { v4 as uuid } from "uuid";
import { checkUserExistence, createUser } from "@/lib/actions/user";
import { types } from "node:util";
import { generateSecurePassword } from "@/utils/secure/generateSecurePassword";
import { NextRequest, userAgent } from "next/server";
import { getIpAddress } from "@/utils/secure/getIpAddress";
import { generateSessionToken } from "@/utils/secure/generateSessionToken";
import { createSession } from "@/lib/actions/session";
import { setSessionTokenCookie } from "@/lib/actions/cookies";
import { getMonthForwardDate } from "@/utils/misc/getMonthForwardDate";
import { PAGE_ROUTES } from "@/configs/pages";
import { UniversalUserResponseType } from "@/types/OAuth2/Responses/UniversalUserResponse.type";
import { ProviderListType } from "@/types/OAuth2/Provider/ProviderList.type";
import getUniversalOAuth2UserResponse from "@/utils/misc/getUniversalOAuth2UserResponse";

export async function handleCallback({
    request,
    provider,
    providerName,
    fetchUserProfile,
}: {
    request: NextRequest;
    provider: {
        validateAuthorizationCode: (code: string) => Promise<{
            accessToken: () => string;
        }>;
    };
    providerName: ProviderListType;
    fetchUserProfile: (accessToken: string) => Promise<Response>;
}): Promise<string> {
    console.log('success 1?');

    let tokens;
    let accessToken;

    const cookieStore = await cookies();
    const code = request.nextUrl.searchParams.get("code") as string;
    const state = request.nextUrl.searchParams.get("state") as string;
    const storedState = cookieStore.get('state')?.value as string;
    const errorUrl = cookieStore.get(OAUTH2_REDIRECT_ERROR_URL_PARAMS)?.value as string;
    console.log("error_url: " + errorUrl);
    if (code === null || storedState === null || state !== storedState) {
        console.log('error 1?');
        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_BAD_REQUEST_PARAMS}`;
    }

    try {
        tokens = await provider.validateAuthorizationCode(code);
        accessToken = tokens.accessToken();
    } catch (e) {
        console.error(e);
        console.log('error 2?');

        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
    }
    console.log('success 2?');

    const response = await fetchUserProfile(accessToken);

    let user: UniversalUserResponseType;

    try {
        const data = await response.json();

        user = getUniversalOAuth2UserResponse({
            data,
            provider: providerName,
        });
    } catch (e) {
        console.error(e);
        console.log('error 3?');

        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
    }
    console.log('success 3?');

    const username = user?.login;
    const email = user?.email ?? `oauth_email_${uuid()}`;
    const userId = `${request.nextUrl.pathname}_${user?.id ?? uuid()}`;

    let userExistence = await checkUserExistence({
        username,
        email,
    });
    let isSameUser = false;
    console.log('success 4?');

    if (types.isNativeError(userExistence)) {
        console.log('error 4?');
        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
    }

    if (userExistence !== null && userExistence.email) {
        console.log('error 5?');
        if (userExistence.id === userId) {
            console.log('success 5?');
            userExistence = null;
            isSameUser = true;
        } else {
            console.log('error 6?');
            return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_USER_EXISTS_PARAMS}`;
        }
    }

    let newUsername;

    if (userExistence !== null && userExistence?.username) {
        newUsername = uuid();
    } else {
        newUsername = username;
    }
    console.log('success 6?');

    if (!isSameUser) {
        console.log('success 7?');
        const secureAccessTokenResponse = await generateSecurePassword({
            password: accessToken,
        });

        if (types.isNativeError(secureAccessTokenResponse)) {
            console.log('error 7?');
            return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
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
            console.log('error 8?');
            return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
        }
    }

    console.log('success 8?');
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
        console.log('error 9?');
        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
    }
    console.log('success 9?');

    await setSessionTokenCookie({
        token: sessionToken,
        expiresAt: getMonthForwardDate(),
    });
    console.log('success 10?');

    return PAGE_ROUTES.PROFILE.ROOT;
}