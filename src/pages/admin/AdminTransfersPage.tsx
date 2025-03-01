import React, { useEffect, useState } from 'react';
import { Table, ScrollArea, Text, Divider, TextInput, Badge } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';

interface Transfer {
    _id: string;
    senderAccountId: string;
    receiverAccountId: string;
    amount: number;
    description: string;
    status: string;
    transferTime: string; // ISO 8601 string
}

const AdminTransfersPage: React.FC = () => {
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<string>(''); // Currently sorted column
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order

    // Fetch transfers from API
    useEffect(() => {
        const fetchTransfers = async () => {
            try {
                const response = await fetch('http://localhost:2004/api/transfers');
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
                const data: Transfer[] = await response.json();
                setTransfers(data || []);
                setFilteredTransfers(data || []);
            } catch (error) {
                console.error('Error fetching transfers:', error);
            }
        };

        fetchTransfers();
    }, []);

    // Filter transfers based on search input
    useEffect(() => {
        const filtered = transfers.filter((transfer) => {
            return (
                transfer.senderAccountId.toLowerCase().includes(search.toLowerCase()) ||
                transfer.receiverAccountId.toLowerCase().includes(search.toLowerCase()) ||
                transfer.description.toLowerCase().includes(search.toLowerCase())
            );
        });
        setFilteredTransfers(filtered);
    }, [search, transfers]);

    // Handle sorting logic
    const handleSort = (column: string) => {
        const order = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(order);

        const sorted = [...filteredTransfers].sort((a, b) => {
            const aValue = a[column as keyof Transfer];
            const bValue = b[column as keyof Transfer];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            } else if (column === 'transferTime') {
                return order === 'asc'
                    ? new Date(a.transferTime).getTime() - new Date(b.transferTime).getTime()
                    : new Date(b.transferTime).getTime() - new Date(a.transferTime).getTime();
            }
            return 0;
        });

        setFilteredTransfers(sorted);
    };

    // Map status to badge colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'green';
            case 'FAILED':
                return 'red';
            case 'PENDING':
                return 'orange';
            default:
                return 'gray';
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                All Transfers
            </Text>
            <Divider mt="sm" size="sm" />

            {/* Tablo için belirgin arkaplan kutusu */}
            <div
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
                    placeholder="Search by Sender, Receiver, or Description"
                    mb="md"
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    style={{ width:  '50%',  margin: '0 auto' }}
                />
                <ScrollArea>
                    <Table
                        withColumnBorders
                        withTableBorder
                        highlightOnHover
                        style={{
                            border: '2px #e0e0e0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }}
                    >
                        <Table.Thead style={{ backgroundColor: '#f5f5f5' }}>
                            <Table.Tr>
                                <Table.Th style={{ textAlign: 'center', cursor: 'pointer'}} onClick={() => handleSort('senderAccountId')}>
                                    Sender
                                    {sortBy === 'senderAccountId' && (
                                        sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                                    )}
                                </Table.Th>
                                <Table.Th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('receiverAccountId')}>
                                    Receiver
                                    {sortBy === 'receiverAccountId' && (
                                        sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                                    )}
                                </Table.Th>
                                <Table.Th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('amount')}>
                                    Amount
                                    {sortBy === 'amount' && (
                                        sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                                    )}
                                </Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Description</Table.Th>
                                <Table.Th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                                    Status
                                    {sortBy === 'status' && (
                                        sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                                    )}
                                </Table.Th>
                                <Table.Th style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('transferTime')}>
                                    Date
                                    {sortBy === 'transferTime' && (
                                        sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                                    )}
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredTransfers.map((transfer) => (
                                <Table.Tr key={transfer._id}>
                                    <Table.Td style={{ textAlign: 'center' }}>{transfer.senderAccountId}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{transfer.receiverAccountId}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>${transfer.amount.toFixed(2)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{transfer.description}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        <Badge color={getStatusColor(transfer.status)} variant="filled">
                                            {transfer.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        {new Date(transfer.transferTime).toLocaleString()}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
};

export default AdminTransfersPage;
