import React, { useEffect, useState } from 'react';
import {
    Table,
    ScrollArea,
    Text,
    Divider,
    Badge,
    Card,
    Button,
    Modal,
    TextInput,
    NumberInput,
    Select,
} from '@mantine/core';
import { DatePicker } from "@mantine/dates";

interface Card {
    cardId: string;
    cardNumber: string;
    cardType: string;
    status: string;
    expirationDate: string;
    creditLimit: number;
    balance: number;
}

const AdminCardsPage: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardType: '',
        status: '',
        expirationDate: '',
        creditLimit: 0,
        balance: 0,
    });

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch('http://localhost:2005/api/cards');
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }
                const data: Card[] = await response.json();
                setCards(data || []);
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };
        fetchCards();
    }, []);

    const handleDelete = async (cardId: string) => {
        console.log("Deleting card with ID:", cardId); // Hangi kartın silindiğini kontrol et
        try {
            const response = await fetch(`http://localhost:2005/api/cards/${cardId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Kartları güvenli şekilde filtrele
                setCards((prevCards) => prevCards.filter((card) => card.cardId !== cardId));
                alert("Card deleted successfully.");
            } else {
                console.error('Failed to delete card, Response Status:', response.status);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };


    const handleEdit = (card: Card) => {
        setSelectedCard(card);
        setFormData({ ...card });
        setIsModalOpen(true);
    };

    const handleChange = (field: keyof Card, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveChanges = async () => {
        if (!selectedCard) return;

        try {
            const response = await fetch(`http://localhost:2005/api/cards/${selectedCard.cardId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedCard = await response.json();
                setCards((prevCards) =>
                    prevCards.map((card) => (card.cardId === updatedCard.cardId ? updatedCard : card))
                );
                setIsModalOpen(false);
            } else {
                console.error('❌ Failed to update card');
            }
        } catch (error) {
            console.error('❌ Error updating card:', error);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
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
                                <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {cards.map((card) => (
                                <Table.Tr key={card.cardId}>
                                    <Table.Td style={{ textAlign: 'center' }}>{card.cardNumber}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{card.cardType}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        <Badge
                                            color={card.status === 'ACTIVE' ? 'green' : 'red'}
                                            variant="filled"
                                        >
                                            {card.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        {new Date(card.expirationDate).toLocaleDateString('en-GB')}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{card.creditLimit.toFixed(2)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{card.balance.toFixed(2)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        <Badge
                                            color="#34a890"
                                            variant="filled"
                                            style={{ cursor: 'pointer' }}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleEdit(card)}
                                        >
                                            EDIT
                                        </Badge>
                                        <Badge
                                            color="#c04e4e"
                                            variant="filled"
                                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleDelete(card.cardId || card.id)}
                                        >
                                            DELETE
                                        </Badge>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card>

            <Modal opened={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Card" size="lg">
                <TextInput
                    label="Card Number"
                    value={formData.cardNumber}
                    onChange={(event) => handleChange("cardNumber", event.currentTarget.value)}
                    mb="md"
                />
                <Select
                    label="Card Type"
                    value={formData.cardType}
                    onChange={(value) => handleChange("cardType", value || '')}
                    data={['DEBIT_CARD', 'CREDIT_CARD']}
                    mb="md"
                />
                <Select
                    label="Status"
                    value={formData.status}
                    onChange={(value) => handleChange("status", value || '')}
                    data={['ACTIVE', 'BLOCKED']}
                    mb="md"
                />
                <DatePicker
                    label="Expiration Date"
                    value={new Date(formData.expirationDate)}
                    onChange={(date) => handleChange("expirationDate", date?.toISOString() || '')}
                    mb="md"
                />
                <Button style={{ backgroundColor: '#34a890' }} fullWidth mt="md" onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </Modal>
        </div>
    );
};

export default AdminCardsPage;
