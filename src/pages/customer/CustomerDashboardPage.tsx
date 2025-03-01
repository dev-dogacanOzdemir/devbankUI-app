import { Container, Grid, SimpleGrid, Card, Text, Button, Modal, TextInput, NumberInput, Notification } from '@mantine/core';
import { useEffect, useState } from 'react';

const getCustomerIdFromLocalStorage = () => {
    return localStorage.getItem('userId') || '';
};

interface Account {
    accountId: string;
    balance: number;
    accountType: string;
}

interface Transfer {
    description: string;
    amount: number;
}

interface CardData {
    cardNumber: string;
}

interface Loan {
    loanType: string;
    amount: number;
}

const CustomerDashboardPage = () => {
    const customerId = getCustomerIdFromLocalStorage();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
    const [cards, setCards] = useState<CardData[]>([]);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(true);

    // Transfer Modal State
    const [isTransferModalOpen, setTransferModalOpen] = useState(false);
    const [transferAmount, setTransferAmount] = useState(0);
    const [transferDescription, setTransferDescription] = useState('');
    const [receiverAccountId, setReceiverAccountId] = useState('');
    const [senderAccountId, setSenderAccountId] = useState('');
    const [transferStatus, setTransferStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                if (!customerId) throw new Error('Müşteri ID bulunamadı!');

                const customerRes = await fetch(`http://localhost:5000/api/customers/${customerId}`);
                if (!customerRes.ok) throw new Error('Failed to fetch customer');
                const customerData = await customerRes.json();
                setCustomerName(`${customerData.name} ${customerData.surname}`);

                const accountsRes = await fetch(`http://localhost:5000/api/customers/${customerId}/accounts`);
                if (!accountsRes.ok) throw new Error('Failed to fetch accounts');
                const accountsData = await accountsRes.json();
                setAccounts(accountsData || []);

                const transfersRes = await fetch(`http://localhost:5000/api/customers/${customerId}/transfers`);
                if (!transfersRes.ok) throw new Error('Failed to fetch transfers');
                const transfersData = await transfersRes.json();
                setRecentTransfers(transfersData.slice(0, 3) || []);

                const [cardsRes, loansRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/customers/${customerId}/cards`),
                    fetch(`http://localhost:5000/api/customers/${customerId}/loans`),
                ]);

                if (cardsRes.ok) setCards(await cardsRes.json());
                if (loansRes.ok) setLoans(await loansRes.json());

                const balance = (accountsData || []).reduce((acc, account) => acc + (account.balance || 0), 0);
                setTotalBalance(balance);

                if (accountsData.length > 0) {
                    setSenderAccountId(accountsData[0].accountId); // İlk hesabı varsayılan seçiyoruz
                }
            } catch (error) {
                console.error('❌ Error fetching customer data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchCustomerData();
        }
    }, [customerId]);

    return (
        <Container my="md">
            {/* Dashboard */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Card shadow="xl" padding="lg" radius="md" withBorder style={{ height: '250px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', textAlign: 'center' }}>
                    <Text size="xl" weight={700} style={{ textTransform: 'uppercase', textAlign: 'left', fontWeight: 'bold' }}>Primary Card</Text>
                    {loading ? <Text>Loading...</Text> : cards.length > 0 ? (
                        <>
                            <Text size="xl" weight={700} style={{ fontSize: '32px', textAlign: 'center', marginTop: '75px', fontFamily: 'monospace' }}>{cards[0]?.cardNumber || '**** **** **** ****'}</Text>
                            <Text size="md" style={{ textAlign: 'right', textTransform: 'uppercase', fontWeight: 'bold',marginTop:'20px' }}>{customerName}</Text>
                        </>
                    ) : <Text>No cards available</Text>}
                </Card>

                <Grid gutter="md">
                    <Grid.Col>
                        <Card shadow="xl" padding="lg" radius="md" withBorder style={{ background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)', textAlign: 'center' }}>
                            <Text size="xl" weight={800}>Total Balance</Text>
                            {loading ? <Text>Loading...</Text> : <Text size="xl" weight={700} style={{ fontSize: '45px' }}>${totalBalance.toFixed(2)}</Text>}
                        </Card>
                    </Grid.Col>

                    {/* Recent Transfers */}
                    <Grid.Col span={12}>
                        <Card shadow="xl" padding="lg" radius="md" withBorder style={{ background: "linear-gradient(135deg, rgba(187,186,186,1) 0%, rgba(255,255,255,1) 100%)", textAlign: 'center' }}>
                            <Text size="lg" weight={800} style={{ textTransform: 'uppercase' }}>Recent Transfer</Text>
                            {loading ? <Text>Loading...</Text> : recentTransfers.length > 0 ? (
                                <Text size="sm" weight={400}>{recentTransfers[0]?.description || 'No description'} - ${recentTransfers[0]?.amount || '0.00'}</Text>
                            ) : <Text>No transfers available</Text>}
                        </Card>
                    </Grid.Col>

                    {/* Active Loan */}
                    <Grid.Col span={12}>
                        <Card shadow="xl" padding="lg" radius="md" withBorder style={{ background: 'linear-gradient(135deg, #84fab0, #8fd3f4)', textAlign: 'center' }}>
                            <Text size="xl" weight={800} style={{ textTransform: 'uppercase' }}>Active Loan</Text>
                            {loading ? <Text>Loading...</Text> : loans.length > 0 ? (
                                <Text size="sm" weight={800}>{loans[0]?.loanType || 'Unknown loan type'} - ${loans[0]?.amount || '0.00'}</Text>
                            ) : <Text>No active loans</Text>}
                        </Card>
                    </Grid.Col>
                </Grid>
            </SimpleGrid>
        </Container>
    );
};

export default CustomerDashboardPage;
