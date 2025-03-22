"use client";

import { API_ROUTES } from "@/configs/api";
import { useEffect, useRef, useState } from "react";

const RESPONSES_COUNT = 3000;

export default function FloodRequests() {
    const startTime = useRef<number | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [allResponsesTime, setAllResponsesTime] = useState<string | null>(null);
    const [responses, setResponses] = useState({
        total: 0,
        success: 0,
        ratelimit: 0,
        other: 0,
    });

    useEffect(() => {
        if (responses.total === (2 * RESPONSES_COUNT) && startTime.current !== null) {
            const t3 = performance.now();

            setAllResponsesTime(`${t3 - startTime.current}`);
        }
    }, [responses]);

    return (
        <>
            <div className="flex flex-col">
                {
                    time && (
                        <div>
                            {time} миллисекунд на {(2 * RESPONSES_COUNT)} запросов
                        </div>
                    )
                }
                {
                    allResponsesTime && (
                        <div>
                            {allResponsesTime} миллисекунд ({Math.round(Number(allResponsesTime) / 1000)} секунд) на {(2 * RESPONSES_COUNT)} запросов
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col">
                <div>
                    {responses.total} total responses
                </div>
                <div>
                    {responses.success} success responses
                </div>
                <div>
                    {responses.ratelimit} ratelimit responses
                </div>
                <div>
                    {responses.other} other responses
                </div>
            </div>
            <button
                onClick={async () => {
                    const t1 = performance.now();

                    startTime.current = t1;

                    for (let i = 0; i < RESPONSES_COUNT; i++) {
                        fetch("https://zen-auth.windstone.space" + API_ROUTES.PROFILE + "?username=notwindstone").then(
                            (data) => {
                                switch (data.status) {
                                    case 200:
                                        setResponses((responsesCount) => {
                                            return {
                                                total: responsesCount.total + 1,
                                                success: responsesCount.success + 1,
                                                ratelimit: responsesCount.ratelimit,
                                                other: responsesCount.other,
                                            };
                                        });

                                        break;
                                    case 503:
                                        setResponses((responsesCount) => {
                                            return {
                                                total: responsesCount.total + 1,
                                                success: responsesCount.success,
                                                ratelimit: responsesCount.ratelimit + 1,
                                                other: responsesCount.other,
                                            };
                                        });

                                        break;
                                    default:
                                        setResponses((responsesCount) => {
                                            return {
                                                total: responsesCount.total + 1,
                                                success: responsesCount.success,
                                                ratelimit: responsesCount.ratelimit,
                                                other: responsesCount.other + 1,
                                            };
                                        });

                                        break;
                                }
                            },
                        );
                        fetch("https://zen-auth.windstone.space" + API_ROUTES.LOGIN, {
                            method: "POST",
                            body: JSON.stringify({
                                login: "notwindstone",
                                password: "1",
                            }),
                        }).then(
                            (data) => {
                                switch (data.status) {
                                    case 200:
                                        setResponses((responsesCount) => {
                                            return {
                                                total: responsesCount.total + 1,
                                                success: responsesCount.success + 1,
                                                ratelimit: responsesCount.ratelimit,
                                                other: responsesCount.other,
                                            };
                                        });

                                        break;
                                    case 503:
                                        setResponses((responsesCount) => {
                                            return {
                                                total: responsesCount.total + 1,
                                                success: responsesCount.success,
                                                ratelimit: responsesCount.ratelimit + 1,
                                                other: responsesCount.other,
                                            };
                                        });

                                        break;
                                    default:
                                        setResponses((responsesCount) => {
                                            return {
                                                total: responsesCount.total + 1,
                                                success: responsesCount.success,
                                                ratelimit: responsesCount.ratelimit,
                                                other: responsesCount.other + 1,
                                            };
                                        });

                                        break;
                                }
                            },
                        );

                        const t2 = performance.now();

                        setTime(`${t2 - t1}`);

                        /*
                        fetch('https://zen-auth.windstone.space/api/profile?username=notwindstone');
                        fetch('https://zen-auth.windstone.space/api/login', {
                            method: "POST",
                        });
                        fetch('https://zen-auth.windstone.space/api/verification', {
                            method: "POST",
                        });
                        fetch('https://zen-auth.windstone.space/api/reset', {
                            method: "POST",
                        });
                         */
                    }
                }}
                className="bg-amber-950 w-fit py-2 px-4"
            >
                run http requests flood?
            </button>
        </>
    );
}