import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../utils/queryKeys';
import { ApiSDK } from '../sdk';
import { useAtomValue } from 'jotai';
import { loggedinUserAtom } from '../store/user.atom';


export const useActiveSubscription = () => {
    const loggedInUser = useAtomValue(loggedinUserAtom);

    const {
        data: subscriptionsResponse,
        isLoading,
        error,
    } = useQuery({
        queryKey: [QueryKeys.mysubscription],
        queryFn: async () => {
            return ApiSDK.SubscriptionsService.getMySubscriptionsApiV1SubscriptionsGet();
        },
        enabled: !!loggedInUser,
        staleTime: 1000 * 60 * 5,
    });

    const activeSubscription = useMemo(() => {
        return subscriptionsResponse?.data?.[0] ?? null;
    }, [subscriptionsResponse]);

    return {
        activeSubscription,
        currentPlanCode: activeSubscription?.plan_code,
        isLoading,
        error,
    };
};