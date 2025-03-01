import React, { useEffect, useState } from 'react';
import {
    Table,
    ScrollArea,
    Text,
    Divider,
    Card,
    Button,
    Modal,
    TextInput,
    NumberInput,
    Badge
} from '@mantine/core';

const getCustomerIdFromLocalStorage = () => {
    return localStorage.getItem('userId') || '';
};

const CustomerTransfersPage: React.FC = () => {
    const customerId = getCustomerIdFromLocalStorage();
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isTransferModalOpen, setTransferModalOpen] = useState(false);
    const [receiverAccountId, setReceiverAccountId] = useState('');
    const [transferAmount, setTransferAmount] = useState(0);
    const [transferDescription, setTransferDescription] = useState('');
    const [transferStatus, setTransferStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        fetchTransfers();
    }, [customerId]);

    const fetchTransfers = async () => {
        try {
            setLoading(true);
            if (!customerId) return;

            const response = await fetch(`http://localhost:5000/api/customers/${customerId}/transfers`);
            if (!response.ok) throw new Error("Failed to fetch transfers");
            const data = await response.json();
            setTransfers(data);
        } catch (error) {
            console.error("❌ Error fetching transfers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTransferSubmit = async () => {
        try {
            setTransferStatus('idle');

            const transferData = {
                senderAccountId: customerId,
                receiverAccountId,
                amount: transferAmount,
                description: transferDescription,
                status: "PENDING",
                transferTime: new Date().toISOString(),
            };

            const response = await fetch("http://localhost:2004/api/transfers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transferData),
            });

            if (!response.ok) throw new Error("Transfer işlemi başarısız!");

            setTransferStatus('success');
            setTransferModalOpen(false);
            fetchTransfers(); // Transfer sonrası listeyi güncelle
            console.log("✅ Transfer başarılı!");
        } catch (error) {
            console.error("❌ Transfer hatası:", error);
            setTransferStatus('error');
        }
    };

    // 🟢 Statüye göre badge rengini belirleme fonksiyonu
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <Badge color="green" variant="filled">COMPLETED</Badge>;
            case "FAILED":
                return <Badge color="red" variant="filled">FAILED</Badge>;
            case "PENDING":
                return <Badge color="yellow" variant="filled">PENDING</Badge>;
            default:
                return <Badge color="gray" variant="filled">{status}</Badge>;
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder', textTransform:'uppercase' }}>
                Transfer Management
            </Text>
            <Divider mt="sm" size="sm" />

            <Card shadow="sm" padding="lg" radius="md" withBorder style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
                margin: '0 auto',
                maxWidth: '1200px',
                border: '1px solid #dcdcdc',
                marginTop: '15px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text size="xl" weight={700} style={{marginLeft:'38%', textTransform: 'uppercase', fontWeight:'bold'}}>Your Recent Transfers</Text>
                    <Button
                        variant="gradient"
                        gradient={{ from: '#9d7433', to: '#c9a646' }}
                        size="md"
                        radius="xl"
                        style={{margin: '20px'}}
                        onClick={() => setTransferModalOpen(true)}
                    >
                        New Transfer
                    </Button>
                </div>

                <ScrollArea>
                    <Table withColumnBorders withTableBorder highlightOnHover>
                        <Table.Thead style={{ backgroundColor: '#f5f5f5' }}>
                            <Table.Tr>
                                <Table.Th style={{ textAlign: 'center' }}>Receiver Account</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Amount</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Description</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Date</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={5} style={{ textAlign: 'center' }}>Loading...</Table.Td>
                                </Table.Tr>
                            ) : transfers.length > 0 ? (
                                transfers.map((transfer, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td style={{ textAlign: 'center' }}>{transfer.receiverAccountId}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>${transfer.amount.toFixed(2)}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{transfer.description || 'No description'}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{getStatusBadge(transfer.status)}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{new Date(transfer.transferTime).toLocaleString()}</Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={5} style={{ textAlign: 'center' }}>No recent transfers available.</Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card>

            {/* Transfer Modal */}
            <Modal opened={isTransferModalOpen} onClose={() => setTransferModalOpen(false)} title="New Transfer" centered>
                <TextInput label="Receiver Account ID" placeholder="Enter recipient's Account ID" value={receiverAccountId} onChange={(event) => setReceiverAccountId(event.currentTarget.value)} />
                <TextInput label="Description" placeholder="Enter description" value={transferDescription} onChange={(event) => setTransferDescription(event.currentTarget.value)} />
                <NumberInput label="Amount" placeholder="Enter amount" value={transferAmount} onChange={setTransferAmount} min={0} />
                <Button fullWidth mt="md" onClick={handleTransferSubmit}>Confirm Transfer</Button>
            </Modal>
        </div>
    );
};

export default CustomerTransfersPage;
