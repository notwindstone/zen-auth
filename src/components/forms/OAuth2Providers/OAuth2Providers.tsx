import { SiGithub, SiGoogle } from "react-icons/si";

export default function OAuth2Providers() {
    return (
        <>
            <a
                className="flex-1 border-gray-200 h-8 flex justify-center items-center text-zinc-800 font-medium border-[1px] rounded-md hover:bg-zinc-100 transition text-sm"
                href="/api/oauth/login/google"
            >
                <div className="flex flex-nowrap items-center gap-2">
                    <SiGoogle/>
                    <p>
                        Google
                    </p>
                </div>
            </a>
            <a
                className="flex-1 border-gray-200 h-8 flex justify-center items-center text-zinc-800 font-medium border-[1px] rounded-md hover:bg-zinc-100 transition text-sm"
                href="/api/oauth/login/github"
            >
                <div className="flex flex-nowrap items-center gap-2">
                    <SiGithub/>
                    <p>
                        Github
                    </p>
                </div>
            </a>
            {/*
                            <a
                                className="flex-1 border-gray-200 h-8 flex justify-center items-center text-zinc-800 font-medium border-[1px] rounded-md hover:bg-zinc-100 transition text-sm"
                                href="/api/oauth/login/shikimori"
                            >
                                <div className="flex flex-nowrap items-center gap-2">
                                    <SiShikimori />
                                    <p>
                                        Shikimori
                                    </p>
                                </div>
                            </a>
                            */}
        </>
    );
}