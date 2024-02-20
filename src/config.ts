export const baseUrl = 'https://7zhz455zj6.execute-api.eu-central-1.amazonaws.com/Prod';

interface ChainData {
    baseUrl: string,
    name: string,
    iconUrl: string,
}

export const chainsData: Record<string, ChainData> = {
    "0x1": { baseUrl: 'https://etherscan.io', name: 'ETH', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg' },
    "0x38": { baseUrl: 'https://bscscan.com', name: 'BSC', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg' },
    "0x89": { baseUrl: 'https://polygonscan.com', name: 'Polygon', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg' },
    "0xa4b1": { baseUrl: 'https://arbiscan.io', name: 'Arbitrum', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg' },
    "0xa86a": { baseUrl: 'https://avascan.info', name: 'Avalanche', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg' },
    "0xfa": { baseUrl: 'https://ftmscan.com', name: 'Fantom', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_fantom.jpg' },
    "0x19": { baseUrl: 'https://cronoscan.com', name: 'Cronos', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_cronos.jpg' },
    "0xa": { baseUrl: 'https://optimistic.etherscan.io', name: 'Optimism', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg' },
    "0x2a15c308d": { baseUrl: 'https://palm.chainlens.com', name: 'Palm', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_palm.jpg' },
    "0x171": { baseUrl: 'https://pulsescan.live/#', name: 'PulseChain', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_pulse.jpg' },
    "0x64": { baseUrl: 'https://gnosisscan.io', name: 'Gnosis', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_xdai.jpg' },
    "0x2105": { baseUrl: 'https://basescan.org', name: 'Base', iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg' }
}

export const getExplorerTxUrl = (chainId: string, txHash: string) => {
    const baseExplorerUrl = chainsData[chainId].baseUrl;
    return `${baseExplorerUrl}/tx/${txHash}`;
}

export const getChainName = (chainId: string) => chainsData[chainId].name;
export const getChainIconUrl = (chainId: string) => chainsData[chainId].iconUrl;

export const getExplorerAddressUrl = (chainId: string, address: string) => {
    const baseExplorerUrl = chainsData[chainId].baseUrl;
    return `${baseExplorerUrl}/address/${address}`;
}