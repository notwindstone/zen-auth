import {
    SiGithub,
    SiGoogle,
    SiShikimori,
} from "react-icons/si";

export default function OAuth2Providers() {
    const pathname = "/register";

    return (
        <>
            <div
                className="select-none min-w-[40%] flex-1 border-gray-200 h-8 flex justify-center items-center text-zinc-400 font-medium border-[1px] rounded-md bg-gray-200 transition text-sm"
                //href="/api/oauth/login/google"
            >
                <div className="flex flex-nowrap items-center gap-2">
                    <SiGoogle/>
                    <p>
                        Google
                    </p>
                </div>
            </div>
            <a
                className="min-w-[40%] flex-1 border-gray-200 h-8 flex justify-center items-center text-zinc-800 font-medium border-[1px] rounded-md hover:bg-zinc-100 transition text-sm"
                href={"/api/oauth/login/github?error_url=" + pathname}
            >
                <div className="flex flex-nowrap items-center gap-2">
                    <SiGithub/>
                    <p>
                        Github
                    </p>
                </div>
            </a>
            <a
                className="min-w-[40%] flex-[2] border-gray-200 h-8 flex justify-center items-center text-zinc-800 font-medium border-[1px] rounded-md hover:bg-zinc-100 transition text-sm"
                href={"/api/oauth/login/shikimori?error_url=" + pathname}
            >
                <div className="flex flex-nowrap items-center gap-2">
                    <SiShikimori />
                    <p>
                        Shikimori
                    </p>
                </div>
            </a>
        </>
    );
}