import { Button, Checkbox, Container, FormControl, FormGroup, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { baseUrl, getChainIconUrl, getChainName } from "../config";
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

interface IAddWalletFormData {
    walletAddress: string,
    title: string,
    chainIds: string[]
}

interface Chain {
    id: string,
    name: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const getWallets = async () => {
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

const getChains = async () => {
    const res = await axios.get(`${baseUrl}/api/admin/supported-chains`);
    return res.data as Chain[];
}


export const AddWalletPage = () => {
    const [wallets, setWallets] = useState<IWalletData[]>([]);
    const [formData, setFormData] = useState<IAddWalletFormData>({
        walletAddress: '',
        title: '',
        chainIds: []
    });

    const [chains, setChains] = useState<Chain[]>([]);

    useEffect(() => {
        (async () => {
            const data = await getWallets();
            const chains = await getChains();
            setChains(chains);
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
            <Container>
                <Paper sx={{ marginBottom: 4 }}>
                    <Typography component='h2' variant='h4' align="center" padding={2}>Add New Wallet</Typography>

                    <FormGroup sx={{ maxWidth: 600, height: 300, padding: '20px 0 30px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                        <TextField fullWidth label="Wallet Address" variant="outlined" onChange={(e) => setFormField('walletAddress', e.target.value)} />
                        <TextField fullWidth label="Title" variant="outlined" onChange={(e) => setFormField('title', e.target.value)} />
                        <FormControl>
                            <InputLabel id="demo-multiple-checkbox-label">Chains</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={formData.chainIds}
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    setFormData(prev => ({
                                        ...prev,
                                        chainIds: !e.target.value ? [] : typeof e.target.value === 'string' ? [e.target.value] : [...e.target.value]
                                    }));
                                }}
                                input={<OutlinedInput label="Chain" />}
                                renderValue={(selected) => chains.filter((s) => selected.some(q => q === s.id)).map(s => s.name).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {chains.map((chain) => (
                                    <MenuItem key={chain.id} value={chain.id}>
                                        <Checkbox checked={formData.chainIds.some(s => s === chain.id)} />
                                        <ListItemText primary={chain.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                                    <TableCell>
                                        {s.chainIds.map(s => (
                                            <p>
                                                <img style={{ verticalAlign: 'middle' }} src={getChainIconUrl(s)} alt="Icon" width={24} /> {getChainName(s)}
                                            </p>
                                        ))}
                                    </TableCell>
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
            </Container>
        </>
    )
}