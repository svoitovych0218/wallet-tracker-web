import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import axios from "axios";
import { baseUrl, chainsData } from "../config";
import { useEffect, useState } from "react";

enum TransferType {
    In = 1,
    Out = 2,
}

interface ITransfer {
    tokenName: string,
    tokenSymbol: string,
    amount: number,
    transferType: TransferType,
    contractAddress: string;
}

interface ITransactionApiRequest {
    walletAddress: string,
    txHash: string,
    at: string,
    chainId: string,
    transfers: ITransfer[]
}

interface ITransaction {
    walletAddress: string,
    txHash: string,
    at: Date,
    chainId: string,
    transfers: ITransfer[]
}

export const getTransactions = async () => {
    const res = await axios.get(`${baseUrl}/api/admin/get-transactions`);
    const result = (res.data.transactions as ITransactionApiRequest[]).map(s => ({
        walletAddress: s.walletAddress,
        txHash: s.txHash,
        at: new Date(s.at),
        chainId: s.chainId,
        transfers: [...s.transfers]
    } as ITransaction));

    return result;
}

export const getExplorerTxUrl = (chainId: string, txHash: string) => {
    const baseExplorerUrl = chainsData[chainId].baseUrl;
    return `${baseExplorerUrl}/tx/${txHash}`;
}

export const getChainName = (chainId: string) => chainsData[chainId].name;

export const getExplorerAddressUrl = (chainId: string, address: string) => {
    const baseExplorerUrl = chainsData[chainId].baseUrl;
    return `${baseExplorerUrl}/address/${address}`;
}

export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [counter, setCounter] = useState<number>(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCounter(prev => prev + 1);
            clearTimeout(timeoutId);
        }, 5000);
    }, [counter]);

    useEffect(() => {
        (async () => {
            const data = await getTransactions();
            setTransactions(data);
        })();
    }, [counter]);
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: 1200 }}>
                    <Paper sx={{ padding: '20px 20px 30px 20px', margin: '10px 0 20px 0' }}>
                        <Typography variant="h4" component='h4'>Transaction History</Typography>

                    </Paper>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 800 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Wallet Address</TableCell>
                                    <TableCell align="left">TxHash</TableCell>
                                    <TableCell align="left">At</TableCell>
                                    <TableCell align="left">Chain</TableCell>
                                    <TableCell align="left">Data</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map(s => (
                                    <TableRow>
                                        <TableCell>{s.walletAddress}</TableCell>
                                        <TableCell><a href={`${getExplorerTxUrl(s.chainId, s.txHash)}`} target="_blank" rel="noreferrer">View Explorer</a></TableCell>
                                        <TableCell>{s.at.toLocaleString()}</TableCell>
                                        <TableCell>{getChainName(s.chainId)}</TableCell>
                                        <TableCell>{s.transfers.map(q => (
                                            <>
                                                <span style={{ color: q.transferType === TransferType.Out ? 'red' : '#05fb05', fontWeight: 700 }}>
                                                    <a style={{ color: q.transferType === TransferType.Out ? 'red' : '#05fb05' }} href={getExplorerAddressUrl(s.chainId, q.contractAddress)}>{q.tokenSymbol}</a> {q.amount.toFixed(3)}</span>
                                                <br />
                                            </>
                                        ))}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </>
    )
}