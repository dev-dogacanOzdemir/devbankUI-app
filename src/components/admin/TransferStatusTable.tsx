import { useEffect, useState } from 'react';
import { Table, ScrollArea, Text, Grid, Divider } from '@mantine/core';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TransferStatus } from '../../types/DashboardTypes.ts';

// Gerekli Chart.js bileşenlerini kaydetme
ChartJS.register(ArcElement, Tooltip, Legend);

const TransferStatusTable = () => {
    const [transferStatuses, setTransferStatuses] = useState<TransferStatus[]>([]);
    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as 'bottom', // Tip hatasını giderir
            },
        },
    };

    useEffect(() => {
        const fetchTransferStatuses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/transfers-by-status');
                const data: TransferStatus[] = await response.json();
                setTransferStatuses(data);
            } catch (error) {
                console.error('Error fetching transfer statuses:', error);
            }
        };

        fetchTransferStatuses();
    }, []);

    const pieData = {
        labels: transferStatuses.map((status) => status._id),
        datasets: [
            {
                data: transferStatuses.map((status) => status.count),
                backgroundColor: transferStatuses.map((status) => {
                    switch (status._id) {
                        case 'COMPLETED':
                            return '#39833c'; // Yeşil
                        case 'PENDING':
                            return '#FFC107'; // Sarı
                        case 'FAILED':
                            return '#ea2111'; // Kırmızı
                        default:
                            return '#9E9E9E'; // Gri (Bilinmeyen durumlar için)
                    }
                }),
            },
        ],
    };

    return (
        <div>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Transfer Information
                <Divider mt="sm" size="sm" />
            </Text>
            <Grid>
                {/* Table Section */}
                <Grid.Col span={6} mt="xl">
                    <Text size="lg" mb="md" style={{ textAlign: 'center' }}>
                        Transfer Status
                        <Divider size="xs"/>
                    </Text>
                    <ScrollArea>
                        <Table withColumnBorders withTableBorder highlightOnHover>
                            <Table.Thead style={{ backgroundColor: '#e6e6e6' }}>
                                <Table.Tr>
                                    <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
                                    <Table.Th style={{ textAlign: 'center' }}>Count</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {transferStatuses.map((status) => (
                                    <Table.Tr key={status._id}>
                                        <Table.Td style={{ textAlign: 'center' }}>{status._id}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{status.count}</Table.Td>
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

export default TransferStatusTable;
