import useSWR from "swr";
import { SessionData, defaultSession } from "@/lib/sessions";
import useSWRMutation from "swr/mutation";
import {UserData} from "@/types/UserData.type";

const sessionApiRoute =
    "/session";

async function fetchJson<JSON = unknown>(
    input: RequestInfo,
    init?: RequestInit,
): Promise<JSON> {
    return fetch(input, {
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
        ...init,
    }).then((res) => res.json());
}

function doLogin(url: string, { arg }: { arg: UserData }) {
    return fetchJson<SessionData>(url, {
        method: "POST",
        body: JSON.stringify({ ...arg }),
    });
}

function doLogout(url: string) {
    return fetchJson<SessionData>(url, {
        method: "DELETE",
    });
}

export default function useSession() {
    const { data: session, isLoading } = useSWR(
        sessionApiRoute,
        fetchJson<SessionData>,
        {
            fallbackData: defaultSession,
        },
    );

    const { trigger: login } = useSWRMutation(sessionApiRoute, doLogin, {
        revalidate: false,
    });
    const { trigger: logout } = useSWRMutation(sessionApiRoute, doLogout);

    return { session, logout, login, isLoading };
}