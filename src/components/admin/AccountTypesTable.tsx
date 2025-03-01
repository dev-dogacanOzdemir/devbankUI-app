// Import necessary libraries
import { useEffect, useState } from 'react';
import { Table, ScrollArea, Text, Grid, Divider } from '@mantine/core';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { AccountType } from '../../types/DashboardTypes.ts';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AccountTypesTable = () => {
    const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as 'bottom',
            },
        },
    };

    useEffect(() => {
        const fetchAccountTypes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/accounts-by-type');
                const data: AccountType[] = await response.json();
                setAccountTypes(data);
            } catch (error) {
                console.error('Error fetching account types:', error);
            }
        };

        fetchAccountTypes();
    }, []);

    const pieData = {
        labels: accountTypes.map((type) => type._id),
        datasets: [
            {
                data: accountTypes.map((type) => type.count),
                backgroundColor: accountTypes.map((type) => {
                    switch (type._id) {
                        case 'CURRENT':
                            return '#2196F3'; // Blue
                        case 'SAVINGS':
                            return '#FF9800'; // Orange
                        default:
                            return '#9E9E9E'; // Gray
                    }
                }),
            },
        ],
    };

    return (
        <div>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Account Information
                <Divider mt="sm" size="sm" />
            </Text>
            <Grid>
                {/* Table Section */}
                <Grid.Col span={6}>
                    <Text size="lg" mb="md" mt="xl" style={{ textAlign: 'center' }}>
                        Account Types
                        <Divider size="xs"/>
                    </Text>
                    <ScrollArea>
                        <Table withColumnBorders withTableBorder highlightOnHover >
                            <Table.Thead style={{ backgroundColor: '#e6e6e6' }}>
                                <Table.Tr>
                                    <Table.Th style={{ textAlign: 'center' }}>Type</Table.Th>
                                    <Table.Th style={{ textAlign: 'center' }}>Count</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {accountTypes.map((type) => (
                                    <Table.Tr key={type._id}>
                                        <Table.Td style={{ textAlign: 'center' }}>{type._id}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{type.count}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Grid.Col>

                {/* Pie Chart Section */}
                <Grid.Col span={6}>
                    <div style={{ width: '300px', height: '300px', marginLeft: '150px' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </Grid.Col>
            </Grid>
        </div>
    );
};

export default AccountTypesTable;
