import  { useEffect, useState } from 'react';
import {SimpleGrid, Card, Text, Group, Divider} from '@mantine/core';

interface Summary {
    totalUsers: number;
    totalAccounts: number;
    totalTransfers: number;
    totalLogins: number;
}

const DashboardStats = () => {
    const [summary, setSummary] = useState<Summary | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/summary');
                const data: Summary = await response.json();
                setSummary(data);
            } catch (error) {
                console.error('Error fetching dashboard summary:', error);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div>
            <Text size="30px" mb="xl" mt="sm" style={{textAlign: "center", fontWeight: "bolder",}}>
                Dashboard Summary
                <Divider mt ='sm' size='xs'/>
            </Text>
            <SimpleGrid cols={4} mb="sm">
                {summary && (
                    <>
                        <Card shadow="lg" withBorder={true} padding="lg" radius="md">
                            <Group style={{ justifyContent: 'space-between' }}>
                                <Text size="sm" color="dimmed">
                                    Total Users
                                </Text>
                                <Text size="xl" fw={700}>
                                    {summary.totalUsers}
                                </Text>
                            </Group>
                        </Card>

                        <Card shadow="sm" withBorder={true} padding="lg" radius="md">
                            <Group style={{ justifyContent: 'space-between' }}>
                                <Text size="sm" color="dimmed">
                                    Total Accounts
                                </Text>
                                <Text size="xl" fw={700}>
                                    {summary.totalAccounts}
                                </Text>
                            </Group>
                        </Card>

                        <Card shadow="sm" withBorder={true} padding="lg" radius="md">
                            <Group style={{ justifyContent: 'space-between' }}>
                                <Text size="sm" color="dimmed">
                                    Total Transfers
                                </Text>
                                <Text size="xl" fw={700}>
                                    {summary.totalTransfers}
                                </Text>
                            </Group>
                        </Card>

                        <Card shadow="sm" withBorder={true} padding="lg" radius="md">
                            <Group style={{ justifyContent: 'space-between' }}>
                                <Text size="sm" color="dimmed">
                                    Total Logins
                                </Text>
                                <Text size="xl" fw={700}>
                                    {summary.totalLogins}
                                </Text>
                            </Group>
                        </Card>
                    </>
                )}
            </SimpleGrid>
        </div>
    );
};

export default DashboardStats;
