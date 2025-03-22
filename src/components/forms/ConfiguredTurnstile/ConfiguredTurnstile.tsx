import { Turnstile } from "next-turnstile";

export default function ConfiguredTurnstile({
    id,
    onError,
    onExpire,
    onLoad,
    onVerify,
}: {
    id: string;
    onError?: (error?: unknown) => void;
    onExpire?: () => void;
    onLoad?: () => void;
    onVerify?: (token?: string) => void;
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