import { Turnstile } from "next-turnstile";

export default function ConfiguredTurnstile({
    onError,
    onExpire,
    onLoad,
    onVerify,
}: {
    onError?: (error?: unknown) => void;
    onExpire?: () => void;
    onLoad?: () => void;
    onVerify?: (token?: string) => void;
}) {
    return (
        <Turnstile
            className={"__global-cloudflare-turnstile relative min-h-[65px] flex w-full justify-center before:content-['Если_капча_не_появляется,_значит_ваша_сеть_блокирует_Cloudflare_Turnstile'] before:text-center before:text-balance before:absolute before:text-zinc-900 before:text-xs sm:before:text-sm before:-z-10 before:top-2 sm:before:top-4 sm:before:px-9"}
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