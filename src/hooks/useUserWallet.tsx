import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../sdk";
import { QueryKeys } from "../utils/queryKeys";

export const useUserWallet = () => {
    return useQuery({
        queryKey: [QueryKeys.wallet],
        queryFn: async () => {
            const response =
                await ApiSDK.WalletService.getMyWalletApiV1WalletGet();

            return {
                symbol: response.currency,
                isLocked: response.is_locked,
                balance: response.balance,
            };
        },
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
        staleTime: 10000,
    });
};