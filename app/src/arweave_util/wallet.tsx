// source: https://docs.arweavekit.com/wallets/wallet-kit
import { useConnection, useActiveAddress } from "arweave-wallet-kit";

export const useLogin = () => {
  const { connect, disconnect } = useConnection();
  const activeAddress = useActiveAddress();

  const login = async () => {
    connect();
    return activeAddress;
  };

  const logout = async () => {
    await disconnect();
  };

  return {
    login,
    logout,
    activeAddress,
  };
};
