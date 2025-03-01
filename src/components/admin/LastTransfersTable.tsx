import { useEffect, useState } from 'react';
import { Table, ScrollArea, Text, Divider } from '@mantine/core';

interface Transfer {
    sender: string;
    receiver: string;
    amount: number;
    date: string;
    status: string;
}

const LastTransfersTable = () => {
    const [transfers, setTransfers] = useState<Transfer[]>([]);

    useEffect(() => {
        const fetchLastTransfers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/last-transfers');
                const data: Transfer[] = await response.json();
                setTransfers(data);
            } catch (error) {
                console.error('Error fetching last transfers:', error);
            }
        };

        fetchLastTransfers();
    }, []);

    return (
        <div>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Last Transfers
                <Divider mt="sm" size="sm" />
            </Text>
            <ScrollArea>
                <Table withColumnBorders withTableBorder highlightOnHover>
                    <Table.Thead style={{ backgroundColor: '#e6e6e6' }}>
                        <Table.Tr>
                            <Table.Th style={{ textAlign: 'center' }}>Sender</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Receiver</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Amount</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Date</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {transfers.map((transfer, index) => (
                            <Table.Tr key={index}>
                                <Table.Td style={{ textAlign: 'center' }}>{transfer.sender}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{transfer.receiver}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{transfer.amount}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{new Date(transfer.date).toLocaleString()}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{transfer.status}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </div>
    );
};

export default LastTransfersTable;
