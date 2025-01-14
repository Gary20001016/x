import {
  Nft,
  NftCollection,
  TokenListToken,
} from '@etherspot/prime-sdk/dist/sdk/data';
import { ethers } from 'ethers';
import { avalanche, base, bsc, gnosis, polygon, sepolia } from 'viem/chains';

// images
import logoAvalanche from '../assets/images/logo-avalanche.png';
import logoBase from '../assets/images/logo-base.png';
import logoBsc from '../assets/images/logo-bsc.png';
import logoEvm from '../assets/images/logo-evm.png';
import logoGnosis from '../assets/images/logo-gnosis.png';
import logoPolygon from '../assets/images/logo-polygon.png';

export const isValidEthereumAddress = (
  address: string | undefined
): boolean => {
  if (!address) return false;

  try {
    return ethers.utils.isAddress(address);
  } catch (e) {
    //
  }

  return false;
};

// WRAPPED MATIC & MATIC are interchangeably Polygon native assets
export const WRAPPED_MATIC_TOKEN_ADDRESS =
  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';

export const isPolygonAssetNative = (address: string, chainId: number) =>
  (address === ethers.constants.AddressZero ||
    address === WRAPPED_MATIC_TOKEN_ADDRESS) &&
  chainId === 137;

/**
 * Cross-check for supported with:
 * - https://etherspot.fyi/prime-sdk/chains-supported
 * - https://docs.privy.io/guide/configuration/networks#default-configuration
 */
export const getNativeAssetForChainId = (chainId: number): TokenListToken => {
  // return different native asset for chains where it's not Matic (MATIC), otherwise return Matic (MATIC)
  // only mumbai testnet is supported on Prime SDK
  const nativeAsset = {
    chainId,
    address:
      ethers.constants.AddressZero ||
      (chainId === 137 && WRAPPED_MATIC_TOKEN_ADDRESS),
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    logoURI:
      'https://public.etherspot.io/buidler/chain_logos/native_tokens/matic.png',
  };

  // gnosis testnet not supported on Prime SDK
  if (chainId === gnosis.id) {
    nativeAsset.name = 'XDAI';
    nativeAsset.symbol = 'XDAI';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/native_tokens/xdai.png';
  }

  // avalanche testnet not supported on Prime SDK
  if (chainId === avalanche.id) {
    nativeAsset.name = 'AVAX';
    nativeAsset.symbol = 'AVAX';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/avalanche.svg';
  }

  // bsc testnet not supported on Prime SDK
  if (chainId === bsc.id) {
    nativeAsset.name = 'BNB';
    nativeAsset.symbol = 'BNB';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/binance.svg';
  }

  // base testnet not supported on Prime SDK
  if (chainId === base.id) {
    nativeAsset.name = 'Ether';
    nativeAsset.symbol = 'ETH';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/ethereum.png';
  }

  if (chainId === sepolia.id) {
    nativeAsset.name = 'Sepolia ETH';
    nativeAsset.symbol = 'SETH';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/ethereum.png';
  }

  return nativeAsset;
};

export const supportedChains = [polygon, gnosis, base, sepolia];

export const visibleChains = supportedChains.filter((chain) =>
  process.env.REACT_APP_USE_TESTNETS === 'true' ? chain.testnet : !chain.testnet
);

export const parseNftTitle = (collection: NftCollection, nft: Nft): string => {
  return nft.name ? nft.name : `${collection.contractName} #${nft.tokenId}`;
};

export const getLogoForChainId = (chainId: number): string => {
  if (chainId === polygon.id) {
    return logoPolygon;
  }

  if (chainId === gnosis.id) {
    return logoGnosis;
  }

  if (chainId === avalanche.id) {
    return logoAvalanche;
  }

  if (chainId === bsc.id) {
    return logoBsc;
  }

  if (chainId === base.id) {
    return logoBase;
  }

  return logoEvm;
};

export const truncateAddress = (
  address: string,
  displayLength = 10
): string => {
  return `${address.slice(
    0,
    Math.round(displayLength * 0.6)
  )}...${address.slice(-Math.round(displayLength * 0.4))}`;
};

export const decodeSendTokenCallData = (callData: string) =>
  ethers.utils.defaultAbiCoder.decode(
    ['address', 'uint256'],
    ethers.utils.hexDataSlice(callData, 4)
  );

export const isApproveTransaction = (callData: string) => {
  const methodId = callData.slice(0, 10);

  // ERC-20 approve method id in hexadecimal format
  const approveMethodId = '0x095ea7b3';
  return methodId === approveMethodId;
};
