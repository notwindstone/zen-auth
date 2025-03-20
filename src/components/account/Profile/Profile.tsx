"use client";

import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/configs/api";
import { NO_RETRY_ERRORS } from "@/configs/constants";
import ProfileUser from "@/components/account/Profile/ProfileUser/ProfileUser";
import { TableSessionType, TableUserType } from "@/db/schema";
import ProfileSession from "@/components/account/Profile/ProfileSession/ProfileSession";
import LogOut from "@/components/account/LogOut/LogOut";

export default function Profile({
    username,
    token,
}: {
    username?: string | undefined;
    token?: string | undefined;
}) {
    const queryKey = [API_ROUTES.SESSION.CURRENT, API_ROUTES.PROFILE, username, token];
    const {
        isPending,
        error,
        data,
        failureCount,
        failureReason,
    } = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<{
            session: TableSessionType;
            user: TableUserType;
        }> => {
            let response;

            if (!username) {
                response = await fetch(API_ROUTES.SESSION.CURRENT);
            } else {
                response = await fetch(`${API_ROUTES.PROFILE}?username=${username}`);
            }

            if (!response.ok) {
                return Promise.reject(
                    new Error(
                        response.status.toString(),
                    ),
                );
            }

            return await response.json();
        },
        retry: (failureCount, error) => {
            return !(NO_RETRY_ERRORS.has(Number(error.message)) || failureCount > 3);
        },
    });

    if (isPending) {
        return (
            <div>
                <p>
                    Loading...
                </p>
                {
                    failureCount > 0 && (
                        <p>
                            {failureCount} retries. Current error: {failureReason?.message}
                        </p>
                    )
                }
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>
                    An error has occurred: {error.message}
                </p>
            </div>
        );
    }

    const user = data?.user;
    const session = data?.session;

    return (
        <div>
            <ProfileSession
                mutationKey={queryKey}
                { ...session }
            />
            <ProfileUser
                { ...user }
            />
            <LogOut />
        </div>
    );
}