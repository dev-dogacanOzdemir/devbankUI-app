import React, { useEffect, useState } from 'react';
import {
    Table,
    ScrollArea,
    Text,
    Divider,
    Card,
    Badge
} from '@mantine/core';

const getCustomerIdFromLocalStorage = () => {
    return localStorage.getItem('userId') || '';
};

const CustomerAccountsPage: React.FC = () => {
    const customerId = getCustomerIdFromLocalStorage();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, [customerId]);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            if (!customerId) return;

            const response = await fetch(`http://localhost:5000/api/customers/${customerId}/accounts`);
            if (!response.ok) throw new Error("Failed to fetch accounts");
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error("❌ Error fetching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                Account Management
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
                    <Text size="xl" weight={700} style={{ marginLeft: '38%', textTransform: 'uppercase', fontWeight: 'bold' }}>Your Accounts</Text>
                </div>

                <ScrollArea>
                    <Table withColumnBorders withTableBorder highlightOnHover>
                        <Table.Thead style={{ backgroundColor: '#f5f5f5' }}>
                            <Table.Tr>
                                <Table.Th style={{ textAlign: 'center' }}>Account ID</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Account Type</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Balance</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Created Date</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={4} style={{ textAlign: 'center' }}>Loading...</Table.Td>
                                </Table.Tr>
                            ) : accounts.length > 0 ? (
                                accounts.map((account, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td style={{ textAlign: 'center' }}>{account.uniqueAccountNumber}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>
                                            <Badge color={account.accountType === 'CURRENT' ? '#2e617f' : '#7e2e2e'} variant="filled">
                                                {account.accountType}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>${account.balance.toFixed(2)}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{new Date(account.createdAt).toLocaleString()}</Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={4} style={{ textAlign: 'center' }}>No accounts available.</Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card>

        </div>
    );
};

export default CustomerAccountsPage;
