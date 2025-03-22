import { Turnstile } from "next-turnstile";

export default function ConfiguredTurnstile({
    onError,
    onExpire,
    onLoad,
    onVerify,
    id,
}: {
    onError?: (error?: unknown) => void;
    onExpire?: () => void;
    onLoad?: () => void;
    onVerify?: (token?: string) => void;
    id?: string;
}) {
    return (
        <Turnstile
            id={id}
            className="flex w-full justify-center"
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            retry="auto"
            refreshExpired="auto"
            sandbox={process.env.NODE_ENV === "development"}
            onError={onError}
            onExpire={onExpire}
            onLoad={onLoad}
            onVerify={onVerify}
        />
    );
}