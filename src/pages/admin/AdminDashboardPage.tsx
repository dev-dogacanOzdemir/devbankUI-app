

import { Container, Grid, Card, Text } from '@mantine/core';
import AccountTypesTable from "../../components/admin/AccountTypesTable.tsx";
import UserRolesTable from "../../components/admin/UserRolesTable.tsx";
import TransferStatusTable from "../../components/admin/TransferStatusTable.tsx";
import LastTransfersTable from "../../components/admin/LastTransfersTable.tsx";
import LastLoginsTable from "../../components/admin/LastLoginsTable.tsx";
import DashboardStats from "../../components/admin/DashboardStats.tsx";

const AdminDashboardPage = () => {
    return (
        <Container size="lg">
            <Text size="55px" w={1110} style={{textAlign: 'center',}} mb="xl">
                <h1 style={{ fontSize: "55px", fontWeight: "bold", color: "#34495e"}}>Welcome, Admin</h1>
                <p style={{ fontSize: "20px", color: "#7f8c8d"}}>Here’s an overview of your system’s current performance.</p>
            </Text>
            <Grid>
                <Grid.Col span={12}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <DashboardStats/>
                    </Card>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <AccountTypesTable />
                    </Card>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <UserRolesTable />
                    </Card>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <TransferStatusTable />
                    </Card>
                </Grid.Col>
                <Grid.Col>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <LastTransfersTable/>
                    </Card>
                </Grid.Col>
                <Grid.Col>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <LastLoginsTable/>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default AdminDashboardPage;
