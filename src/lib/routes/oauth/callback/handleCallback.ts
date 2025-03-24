"use server";

import { cookies } from "next/headers";
import {
    OAUTH2_BAD_REQUEST_PARAMS,
    OAUTH2_ERROR_BASE_PARAMS,
    OAUTH2_INTERNAL_SERVER_ERROR_PARAMS,
    OAUTH2_REDIRECT_ERROR_URL_PARAMS,
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
    let tokens;
    let accessToken;

    const cookieStore = await cookies();
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const storedState = cookieStore.get('state')?.value;
    const errorUrl = cookieStore.get(OAUTH2_REDIRECT_ERROR_URL_PARAMS)?.value ?? PAGE_ROUTES.REGISTER;

    if (storedState === undefined) {
        return PAGE_ROUTES.OAUTH_DIFFERENT_BROWSER;
    }

    if (code === null || state === null || state !== storedState) {
        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_BAD_REQUEST_PARAMS}`;
    }

    try {
        tokens = await provider.validateAuthorizationCode(code);
        accessToken = tokens.accessToken();
    } catch (e) {
        console.error(e);

        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
    }

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

        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
    }

    const username = user?.login;
    const email = user?.email ?? `oauth_email_${uuid()}`;
    const userId = `${request.nextUrl.pathname}_${user?.id ?? uuid()}`;

    let userExistence = await checkUserExistence({
        username,
        email,
    });
    let isSameUser = false;

    if (types.isNativeError(userExistence)) {
        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
    }

    let newEmail = email;

    if (userExistence !== null && userExistence.email) {
        if (userExistence.id === userId) {
            userExistence = null;
            isSameUser = true;
        } else {

            newEmail = `oauth_${providerName}_${uuid()}`;
        }
    }

    let newUsername;

    if (userExistence !== null && userExistence?.username) {
        newUsername = uuid();
    } else {
        newUsername = username;
    }

    if (!isSameUser) {
        const secureAccessTokenResponse = await generateSecurePassword({
            password: accessToken,
        });

        if (types.isNativeError(secureAccessTokenResponse)) {
            return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
        }

        const { hash } = secureAccessTokenResponse;

        const userDatabaseResponse = await createUser({
            id: userId,
            username: newUsername,
            displayName: newUsername,
            email: newEmail,
            password: hash,
        });

        if (types.isNativeError(userDatabaseResponse)) {
            return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
        }
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
        return errorUrl + `?${OAUTH2_ERROR_BASE_PARAMS}=${OAUTH2_INTERNAL_SERVER_ERROR_PARAMS}`;
    }

    await setSessionTokenCookie({
        token: sessionToken,
        expiresAt: getMonthForwardDate(),
    });

    return PAGE_ROUTES.PROFILE.ROOT;
}