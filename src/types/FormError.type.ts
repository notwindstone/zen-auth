export type FormErrorType = {
    client: {
        hasInputDataError: {
            username: boolean;
            email: boolean;
        };
        hasInitiallyInvalidData: {
            email: boolean;
        };
    };
    server: {
        hasInternalServerError: boolean;
        hasFormError: boolean;
        hasBeenRateLimited: boolean;
        hasDataConflict: {
            username: boolean;
            email: boolean;
        };
        hasUnknownError: boolean;
    }
};