import { CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import axios from "axios";
import { baseUrl, getChainIconUrl, getChainName, getExplorerAddressUrl, getExplorerTxUrl } from "../config";
import { useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
    existsAtCoinMarketCap: boolean;
    contractCodePublished: boolean;
    usdAmount: number | null;
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

export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [counter, setCounter] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setTransactions([]);
            const data = await getTransactions();
            setTransactions(data);
            setIsLoading(false);
        })();
    }, [counter]);
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: 1200, minWidth: 1200 }}>
                    <Paper sx={{ padding: '20px 20px 30px 20px', margin: '10px 0 20px 0' }}>
                        <Typography variant="h4" component='h4'>Transaction History
                            <IconButton style={{ float: 'right' }} onClick={() => setCounter(prev => prev + 1)}>
                                {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
                            </IconButton>
                        </Typography>
                    </Paper>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 800 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Wallet Address</TableCell>
                                    <TableCell align="left">TxHash</TableCell>
                                    <TableCell align="left">At</TableCell>
                                    <TableCell align="left">Chain</TableCell>
                                    <TableCell align="left">In/Out</TableCell>
                                    <TableCell align="left">Token</TableCell>
                                    <TableCell align="left">Amount</TableCell>
                                    <TableCell align="left">USD</TableCell>
                                    <TableCell align="left">
                                        <img style={{ verticalAlign: 'middle' }} alt="Icon" width={24} src="https://www.crypto-nation.io/cn-files/uploads/2021/07/CoinMarketCap-Logo.png" />
                                    </TableCell>
                                    <TableCell align="left">
                                        Contract
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ?
                                    <TableRow>
                                        <TableCell align="center" colSpan={9}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                    :
                                    <>
                                        {transactions.map(s => (
                                            <>
                                                <TableRow>
                                                    <TableCell rowSpan={s.transfers.length}>{`${s.walletAddress.slice(0,5)}...${s.walletAddress.slice(-5)}`}</TableCell>
                                                    <TableCell rowSpan={s.transfers.length}><a href={`${getExplorerTxUrl(s.chainId, s.txHash)}`} target="_blank" rel="noreferrer">View Explorer</a></TableCell>
                                                    <TableCell rowSpan={s.transfers.length}>{s.at.toLocaleString()}</TableCell>
                                                    <TableCell rowSpan={s.transfers.length}>
                                                        <p>
                                                            <img style={{ verticalAlign: 'middle' }} src={getChainIconUrl(s.chainId)} alt="Icon" width={24} /> {getChainName(s.chainId)}
                                                        </p>
                                                    </TableCell>
                                                    {[s.transfers[0]].map(q => (
                                                        <>
                                                            <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                                                {q.transferType === TransferType.In ? (<AddIcon sx={{ color: '#05fb05' }} />) : (<RemoveIcon sx={{ color: 'red' }} />)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <a
                                                                    style={{ color: 'blue', fontWeight: 700 }}
                                                                    href={getExplorerAddressUrl(s.chainId, q.contractAddress)}
                                                                    target="_blank"
                                                                    rel="noreferrer">
                                                                    {q.tokenSymbol}
                                                                </a>
                                                            </TableCell>
                                                            <TableCell>
                                                                {q.amount.toFixed(3)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {q.usdAmount ? `${q.usdAmount.toFixed(3)} $` : ''}
                                                            </TableCell>
                                                            <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                                                {q.existsAtCoinMarketCap ? <CheckCircleOutlineIcon sx={{ color: "#05fb05" }} /> : <CloseIcon style={{ color: 'red' }} />}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {q.contractCodePublished ? <CheckCircleOutlineIcon sx={{ color: "#05fb05" }} /> : <CloseIcon style={{ color: 'red' }} />}
                                                            </TableCell>
                                                        </>
                                                    ))}
                                                </TableRow>
                                                {s.transfers.slice(1).map(q => (
                                                    <TableRow>
                                                        <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                                            {q.transferType === TransferType.In ? (<AddIcon sx={{ color: '#05fb05' }} />) : (<RemoveIcon sx={{ color: 'red' }} />)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <a
                                                                style={{ color: 'blue', fontWeight: 700 }}
                                                                href={getExplorerAddressUrl(s.chainId, q.contractAddress)}
                                                                target="_blank"
                                                                rel="noreferrer">
                                                                {q.tokenSymbol}
                                                            </a>
                                                        </TableCell>
                                                        <TableCell>
                                                            {q.amount.toFixed(3)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {q.usdAmount ? `${q.usdAmount.toFixed(3)} $` : ''}
                                                        </TableCell>
                                                        <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                                            {q.existsAtCoinMarketCap ? <CheckCircleOutlineIcon sx={{ color: "#05fb05" }} /> : <CloseIcon style={{ color: 'red' }} />}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {q.contractCodePublished ? <CheckCircleOutlineIcon sx={{ color: "#05fb05" }} /> : <CloseIcon style={{ color: 'red' }} />}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        ))}
                                    </>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </>
    )
}