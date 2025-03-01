import React, { useEffect, useState } from 'react';
import {
    Table,
    ScrollArea,
    Text,
    Divider,
    TextInput,
    Badge,
    Card,
    Button,
    Modal,
    Select,
    NumberInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';

interface Account {
    accountId: string;
    customerId: string;
    accountType: string;
    balance: number;
    uniqueAccountNumber: string | null;
    createdAt: string;
}

const AdminAccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const [formData, setFormData] = useState<{
        uniqueAccountNumber: string;
        balance: number;
        accountType: string;
        interestRate?: number;
        maturityDate?: Date;
    }>({
        uniqueAccountNumber: '',
        balance: 0,
        accountType: '',
    });

    // Fetch accounts from API
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch('http://localhost:2002/api/accounts');
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
                const data: Account[] = await response.json();
                setAccounts(data || []);
                setFilteredAccounts(data || []);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, []);

    // Filter accounts based on search input
    useEffect(() => {
        const filtered = accounts.filter((account) => {
            const accountNumber = account.uniqueAccountNumber || '';
            const customerId = account.customerId || '';
            return (
                accountNumber.toLowerCase().includes(search.toLowerCase()) ||
                customerId.toLowerCase().includes(search.toLowerCase())
            );
        });
        setFilteredAccounts(filtered);
    }, [search, accounts]);

    // Handle edit button click
    const handleEdit = (account: Account) => {
        setSelectedAccount(account);
        setFormData({
            uniqueAccountNumber: account.uniqueAccountNumber || '',
            balance: account.balance,
            accountType: account.accountType,
        });
        setIsModalOpen(true);
    };

    // Handle delete button click
    const handleDelete = async (accountId: string) => {
        try {
            await fetch(`http://localhost:2002/api/accounts/${accountId}`, { method: 'DELETE' });
            setAccounts((prevAccounts) => prevAccounts.filter((account) => account.accountId !== accountId));
            setFilteredAccounts((prevAccounts) =>
                prevAccounts.filter((account) => account.accountId !== accountId)
            );
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!selectedAccount) return;

        if (formData.accountType === 'SAVINGS') {
            if (!formData.interestRate || !formData.maturityDate) {
                alert('Interest Rate and Maturity Date are required for Savings accounts.');
                return;
            }
        }

        try {
            const response = await fetch(`http://localhost:2002/api/accounts/${selectedAccount.accountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update account');
            }

            const updatedAccount = await response.json();
            setAccounts((prevAccounts) =>
                prevAccounts.map((account) =>
                    account.accountId === updatedAccount.accountId ? updatedAccount : account
                )
            );
            setFilteredAccounts((prevAccounts) =>
                prevAccounts.map((account) =>
                    account.accountId === updatedAccount.accountId ? updatedAccount : account
                )
            );
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Account Details
            </Text>
            <Divider mt="sm" size="sm" />
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
                    margin: '0 auto',
                    maxWidth: '1200px',
                    border: '1px solid #dcdcdc',
                    marginTop : "15px"
                }}
            >
                <TextInput
                    placeholder="Search by Account Number or Customer ID"
                    mb="md"
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    style={{ width: '50%', margin: '0 auto'}}
                />
                <ScrollArea>
                    <Table withColumnBorders withTableBorder highlightOnHover                         style={{
                        border: '2px #e0e0e0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                    }}>
                        <Table.Thead style={{ backgroundColor: '#f5f5f5' }}>
                            <Table.Tr>
                                <Table.Th style={{ textAlign: 'center' }}>Account Number</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Customer ID</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Type</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Balance</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Created At</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredAccounts.map((account) => (
                                <Table.Tr key={account.accountId}>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        {account.uniqueAccountNumber || 'N/A'}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{account.customerId}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{account.accountType}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>${account.balance.toFixed(2)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        {new Date(account.createdAt).toLocaleString()}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <Badge
                                                color="#34a890"
                                                size="lg"
                                                radius="xl"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleEdit(account)}
                                            >
                                                Edit
                                            </Badge>
                                            <Badge
                                                color="#c04e4e"
                                                size="lg"
                                                radius="xl"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDelete(account.accountId)}
                                            >
                                                Delete
                                            </Badge>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card>

            <Modal opened={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Account" size="lg">
                <TextInput
                    label="Account Number"
                    value={formData.uniqueAccountNumber}
                    onChange={(event) =>
                        setFormData((prev) => ({ ...prev, uniqueAccountNumber: event.currentTarget.value }))
                    }
                    mb="md"
                />
                <NumberInput
                    label="Balance"
                    value={formData.balance}
                    onChange={(value) =>
                        setFormData((prev) => ({ ...prev, balance: value || 0 }))
                    }
                    mb="md"
                />
                <Select
                    label="Account Type"
                    value={formData.accountType}
                    onChange={(value) =>
                        setFormData((prev) => ({ ...prev, accountType: value || '' }))
                    }
                    data={['CURRENT', 'SAVINGS']}
                    mb="md"
                />
                {formData.accountType === 'SAVINGS' && (
                    <>
                        <NumberInput
                            label="Interest Rate (%)"
                            value={formData.interestRate || undefined}
                            onChange={(value) =>
                                setFormData((prev) => ({ ...prev, interestRate: value || 0 }))
                            }
                            precision={2}
                            step={0.1}
                            mb="md"
                        />
                        <DatePicker
                            label="Maturity Date"
                            minDate={new Date()}
                            value={formData.maturityDate || null}
                            onChange={(date) =>
                                setFormData((prev) => ({ ...prev, maturityDate: date || undefined }))
                            }
                            mb="md"
                        />
                    </>
                )}
                <Button style={{backgroundColor : '#34a890'}} fullWidth mt="md" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal>
        </div>
    );
};

export default AdminAccountsPage;
