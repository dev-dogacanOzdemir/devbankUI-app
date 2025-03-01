import { useEffect, useState } from 'react';
import { Table, ScrollArea, Text, Grid, Divider } from '@mantine/core';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { UserRole } from '../../types/DashboardTypes.ts';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const UserRolesTable = () => {
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as 'bottom',
            },
        },
    };

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/users-by-role');
                const data: UserRole[] = await response.json();
                setUserRoles(data);
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchUserRoles();
    }, []);

    const pieData = {
        labels: userRoles.map((role) => role._id),
        datasets: [
            {
                data: userRoles.map((role) => role.count),
                backgroundColor: userRoles.map((role) => {
                    switch (role._id) {
                        case 'ROLE_ADMIN':
                            return '#4CAF50'; // Yeşil
                        case 'ROLE_CUSTOMER':
                            return '#FFC107'; // Sarı
                        case 'ROLE_USER':
                            return '#2196F3'; // Mavi
                        default:
                            return '#9E9E9E'; // Gri (Bilinmeyen roller için)
                    }
                }),
            },
        ],
    };

    return (
        <div>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                User Information
                <Divider mt="sm" size="sm" />
            </Text>
            <Grid>
                {/* Table Section */}
                <Grid.Col span={6}>
                    <Text size="lg" mb="md" mt="xl" style={{ textAlign: 'center' }}>
                        User Roles
                        <Divider size="xs"/>
                    </Text>
                    <ScrollArea>
                        <Table withColumnBorders withTableBorder highlightOnHover>
                            <Table.Thead style={{ backgroundColor: '#e6e6e6' }}>
                                <Table.Tr>
                                    <Table.Th style={{ textAlign: 'center' }}>Role</Table.Th>
                                    <Table.Th style={{ textAlign: 'center' }}>Count</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {userRoles.map((role) => (
                                    <Table.Tr key={role._id}>
                                        <Table.Td style={{ textAlign: 'center' }}>{role._id}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{role.count}</Table.Td>
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

export default UserRolesTable;
