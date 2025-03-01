import { useEffect, useState } from 'react';
import { Table, Card, ScrollArea, Group, Text } from '@mantine/core';

// Veri tipleri
interface Currency {
    currencyCode: string;
    rate: number;
}

interface Gold {
    goldType: string;
    sellPrice: number;
    buyPrice: number;
    updatedAt: string;
}

const UserCurrencyGoldPage = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [goldRates, setGoldRates] = useState<Gold[]>([]);
    const [isCurrencyTableOpen, setIsCurrencyTableOpen] = useState(true);
    const [isGoldTableOpen, setIsGoldTableOpen] = useState(true);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await fetch('http://localhost:2003/api/currency-rates');
                const data = await response.json();
                setCurrencies(data || []);
            } catch (error) {
                console.error('Error fetching currencies:', error);
            }
        };

        const fetchGoldRates = async () => {
            try {
                const response = await fetch('http://localhost:2003/api/gold-rates');
                const data = await response.json();
                setGoldRates(data || []);
            } catch (error) {
                console.error('Error fetching gold rates:', error);
            }
        };

        fetchCurrencies();
        fetchGoldRates();
    }, []);

    const StyledButton = ({ label, onClick, color }: { label: string; onClick: () => void; color: string }) => (
        <div
            onClick={onClick}
            style={{
                display: 'inline-block',
                padding: '3px 12px',
                borderRadius: '25px',
                backgroundColor: color,
                color: 'white',
                fontWeight: 600,
                textAlign: 'center',
                cursor: 'pointer',
                minWidth: '65px',
            }}
        >
            {label}
        </div>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px', padding: '20px' }}>
            {/* Currency Table */}
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '80%' }}>
                <Group position="apart">
                    <Text size="lg" weight={600}>
                        Currency Rates
                    </Text>
                    <StyledButton
                        label={isCurrencyTableOpen ? 'Hide' : 'Show'}
                        onClick={() => setIsCurrencyTableOpen(!isCurrencyTableOpen)}
                        color="#2e617f"
                    />
                </Group>
                {isCurrencyTableOpen && (
                    <ScrollArea mt="md">
                        <Table withColumnBorders withTableBorder highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Currency Code</Table.Th>
                                    <Table.Th>Rate</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {currencies.map((currency) => (
                                    <Table.Tr key={currency.currencyCode}>
                                        <Table.Td>{currency.currencyCode}</Table.Td>
                                        <Table.Td>{currency.rate.toFixed(2)}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}
            </Card>

            {/* Gold Table */}
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '80%' }}>
                <Group position="apart">
                    <Text size="lg" weight={600}>
                        Gold Rates
                    </Text>
                    <StyledButton
                        label={isGoldTableOpen ? 'Hide' : 'Show'}
                        onClick={() => setIsGoldTableOpen(!isGoldTableOpen)}
                        color="#2e617f"
                    />
                </Group>
                {isGoldTableOpen && (
                    <ScrollArea mt="md">
                        <Table withColumnBorders withTableBorder highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Gold Type</Table.Th>
                                    <Table.Th>Sell Price</Table.Th>
                                    <Table.Th>Buy Price</Table.Th>
                                    <Table.Th>Updated At</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {goldRates.map((gold) => (
                                    <Table.Tr key={gold.goldType}>
                                        <Table.Td>{gold.goldType}</Table.Td>
                                        <Table.Td>{gold.sellPrice.toFixed(2)}</Table.Td>
                                        <Table.Td>{gold.buyPrice.toFixed(2)}</Table.Td>
                                        <Table.Td>{new Date(gold.updatedAt).toLocaleString()}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}
            </Card>
        </div>
    );
};

export default UserCurrencyGoldPage;
