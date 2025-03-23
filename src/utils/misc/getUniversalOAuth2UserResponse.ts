import { UniversalUserResponseType } from "@/types/OAuth2/Responses/UniversalUserResponse.type";
import { ProviderListType } from "@/types/OAuth2/Provider/ProviderList.type";
import { GithubUserResponseType } from "@/types/OAuth2/Responses/GithubUserResponse.type";
import { ShikimoriUserResponse } from "@/types/OAuth2/Responses/ShikimoriUserResponse.type";

// GitHub, Shikimori
export default function getUniversalOAuth2UserResponse({
    data,
    provider,
}: {
    data: GithubUserResponseType | ShikimoriUserResponse;
    provider: ProviderListType;
}): UniversalUserResponseType {
    const response: UniversalUserResponseType = {
        id: "",
        email: "",
        login: "",
        avatar_url: "",
    };

    switch (provider) {
        case "github":
            response.id = String(data?.id);
            response.avatar_url = String(data?.avatar_url);

            if ('email' in data) {
                response.email = String(data?.email);
            }

            if ('login' in data) {
                response.login = String(data?.login);
            }

            break;
        case "shikimori":
            response.id = String(data?.id);
            response.avatar_url = String(data?.avatar_url);
            response.email = `shikimori_oauth_email_${data?.id}`;

            if ('nickname' in data) {
                response.login = data?.nickname;
            }

            break;
        default:
            throw new Error();
    }

    return response;
}