// Import necessary libraries
import { useEffect, useState } from 'react';
import { Table, ScrollArea, Text, Divider } from '@mantine/core';

interface LoginInfo {
    userId: string;
    ipAddress: string;
    loginTime: string;
}

const LastLoginsTable = () => {
    const [logins, setLogins] = useState<LoginInfo[]>([]);

    useEffect(() => {
        const fetchLastLogins = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/last-logins');
                const data: LoginInfo[] = await response.json();
                setLogins(data);
            } catch (error) {
                console.error('Error fetching last logins:', error);
            }
        };

        fetchLastLogins();
    }, []);

    return (
        <div>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Last Logins
                <Divider mt="sm" size="sm" />
            </Text>
            <ScrollArea>
                <Table withColumnBorders withTableBorder highlightOnHover>
                    <Table.Thead style={{ backgroundColor: '#e6e6e6' }}>
                        <Table.Tr>
                            <Table.Th style={{ textAlign: 'center' }}>User ID</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>IP Address</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Login Time</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {logins.map((login, index) => (
                            <Table.Tr key={index}>
                                <Table.Td style={{ textAlign: 'center' }}>{login.userId}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{login.ipAddress}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{login.loginTime}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </div>
    );
};

export default LastLoginsTable;
