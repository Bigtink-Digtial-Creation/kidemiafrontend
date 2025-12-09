import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useInvalidateQueries = () => {
    const queryClient = useQueryClient();

    const invalidateQueries = useCallback(
        async (queryKeys: Array<string | Array<string | number | undefined>>) => {
            const promises = queryKeys.map((queryKey) =>
                queryClient.invalidateQueries({
                    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
                })
            );

            await Promise.all(promises);
        },
        [queryClient]
    );

    return invalidateQueries;
};


// await invalidateQueries([
//  QueryKeys.leaderboard,
//  QueryKeys.userProfile,
//  [QueryKeys.assessments, assessmentId]
//  ]);