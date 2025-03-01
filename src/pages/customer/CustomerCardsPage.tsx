import React, { useEffect, useState } from 'react';
import {
    Table,
    ScrollArea,
    Text,
    Divider,
    Card,
    Badge,
} from '@mantine/core';

const getCustomerIdFromLocalStorage = () => {
    return localStorage.getItem('userId') || '';
};

const CustomerCardsPage: React.FC = () => {
    const customerId = getCustomerIdFromLocalStorage();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCards();
    }, [customerId]);

    const fetchCards = async () => {
        try {
            setLoading(true);
            if (!customerId) return;

            const response = await fetch(`http://localhost:5000/api/customers/${customerId}/cards`);
            if (!response.ok) throw new Error('Failed to fetch cards');
            const data = await response.json();
            setCards(data);
        } catch (error) {
            console.error('❌ Error fetching cards:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                Card Management
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
                <ScrollArea>
                    <Table withColumnBorders withTableBorder highlightOnHover>
                        <Table.Thead style={{ backgroundColor: '#f5f5f5' }}>
                            <Table.Tr>
                                <Table.Th style={{ textAlign: 'center' }}>Card Number</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Card Type</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Expiration Date</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Credit Limit</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Balance</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7} style={{ textAlign: 'center' }}>Loading...</Table.Td>
                                </Table.Tr>
                            ) : cards.length > 0 ? (
                                cards.map((card, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td style={{ textAlign: 'center' }}>{card.cardNumber}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{card.cardType}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>
                                            <Badge color={card.status === 'ACTIVE' ? 'green' : 'red'} variant="filled">
                                                {card.status}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>
                                            {new Date(card.expirationDate).toLocaleDateString('en-GB')}
                                        </Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>${card.creditLimit.toFixed(2)}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>${card.balance.toFixed(2)}</Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={7} style={{ textAlign: 'center' }}>No cards available.</Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card>
        </div>
    );
};

export default CustomerCardsPage;
