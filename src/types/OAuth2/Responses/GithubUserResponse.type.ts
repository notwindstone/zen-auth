export type GithubUserResponseType = {
    access_token: string;
    user: {
        id: string;
        login: string;
        avatar_url: string;
        email: string;
    };
};