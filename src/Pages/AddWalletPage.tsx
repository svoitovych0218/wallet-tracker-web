import { Button, FormGroup, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { baseUrl } from "../config";
import { Delete } from "@mui/icons-material";

interface IWalletDataApiRequest {
    address: string,
    title: string,
    chainIds: string[],
    notificationsCount: number,
    createdAt: string;
}

interface IWalletData {
    address: string,
    title: string,
    chainIds: string[],
    notificationsCount: number,
    createdAt: Date;
}

export const getWallets = async () => {
    const res = await axios.get(`${baseUrl}/api/admin/get-wallets`);
    const wallets = (res.data as IWalletDataApiRequest[]).map(s => ({
        address: s.address,
        title: s.title,
        chainIds: s.chainIds,
        notificationsCount: s.notificationsCount,
        createdAt: new Date(s.createdAt)
    } as IWalletData))

    return wallets;
}

interface IAddWalletFormData {
    walletAddress: string,
    title: string,
    chainId: string
}

export const AddWalletPage = () => {
    const [wallets, setWallets] = useState<IWalletData[]>([]);
    const [formData, setFormData] = useState<IAddWalletFormData>({
        walletAddress: '',
        title: '',
        chainId: ''
    })

    useEffect(() => {
        (async () => {
            const data = await getWallets();
            setWallets(data);
        })();
    }, [])

    const deleteStreamCallback = useCallback(async (address: string) => {
        await axios.delete(`${baseUrl}/api/admin/stream/${address}`);
        setWallets(prev => [...prev.filter(s => s.address !== address)]);
    }, [setWallets]);

    const setFormField = useCallback((key: keyof (IAddWalletFormData), value: string) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setFormData])

    const addWalletRequest = useCallback(async () => {
        await axios.post(`${baseUrl}/api/admin/create-stream`, formData);
    }, [formData]);

    return (
        <>
            <Paper>
                <Typography component='h2' variant='h4' align="left" padding={2}>Add New Wallet</Typography>

                <FormGroup sx={{ maxWidth: 600, height: 300, padding: '20px 0 30px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <TextField fullWidth label="Wallet Address" variant="outlined" onChange={(e) => setFormField('walletAddress', e.target.value)} />
                    <TextField fullWidth label="Title" variant="outlined" onChange={(e) => setFormField('title', e.target.value)} />
                    <TextField fullWidth label="Chain Id" variant="outlined" onChange={(e) => setFormField('chainId', e.target.value)} />
                    <Button variant='contained' onClick={addWalletRequest}>Add</Button>
                </FormGroup>
            </Paper>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 800 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Wallet Address</TableCell>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">Chains</TableCell>
                            <TableCell align="left">Notification counts</TableCell>
                            <TableCell align="left">Created At</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {wallets.map(s => (
                            <TableRow>
                                <TableCell>{s.address}</TableCell>
                                <TableCell>{s.title}</TableCell>
                                <TableCell>{s.chainIds.join(', ')}</TableCell>
                                <TableCell>{s.notificationsCount}</TableCell>
                                <TableCell>{s.createdAt.toLocaleString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => deleteStreamCallback(s.address)}>
                                        <Delete style={{ color: 'red' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}