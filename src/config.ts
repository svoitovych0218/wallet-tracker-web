export const baseUrl = 'https://7zhz455zj6.execute-api.eu-central-1.amazonaws.com/Prod';

interface ChainData {
    baseUrl: string,
    name: string
}

export const chainsData: Record<string, ChainData> = {
    '0x38': { baseUrl: 'https://bscscan.com', name: 'BSC' }
}