import React, { useEffect, useState } from 'react';
import {
    Table,
    ScrollArea,
    Text,
    Divider,
    Card,
    Button,
    Modal,
    TextInput,
    NumberInput,
    Select,
    Badge,
} from '@mantine/core';

const getCustomerIdFromLocalStorage = () => {
    return localStorage.getItem('userId') || '';
};

const CustomerLoansPage: React.FC = () => {
    const customerId = getCustomerIdFromLocalStorage();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State (Yeni kredi başvurusu için)
    const [isLoanModalOpen, setLoanModalOpen] = useState(false);
    const [loanAmount, setLoanAmount] = useState(0);
    const [termInMonths, setTermInMonths] = useState(12);
    const [interestRate, setInterestRate] = useState(5);
    const [loanType, setLoanType] = useState('');
    const [applicationStatus, setApplicationStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        fetchLoans();
    }, [customerId]);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            if (!customerId) return;

            const response = await fetch(`http://localhost:5000/api/customers/${customerId}/loans`);
            if (!response.ok) throw new Error("Failed to fetch loans");
            const data = await response.json();
            setLoans(data);
        } catch (error) {
            console.error("❌ Error fetching loans:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoanApplication = async () => {
        try {
            setApplicationStatus('idle');

            const loanData = {
                customerId,
                amount: loanAmount,
                termInMonths,
                interestRate,
                loanType,
            };

            const response = await fetch("http://localhost:2006/api/loans/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loanData),
            });

            if (!response.ok) throw new Error("Kredi başvurusu başarısız!");

            setApplicationStatus('success');
            setLoanModalOpen(false);
            fetchLoans(); // Kredi başvurusu sonrası listeyi güncelle
            console.log("✅ Kredi başvurusu başarıyla yapıldı!");
        } catch (error) {
            console.error("❌ Kredi başvurusu hatası:", error);
            setApplicationStatus('error');
        }
    };

    // 🟢 Kredi durumuna göre renkli badge gösterme fonksiyonu
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <Badge color="green" variant="filled">APPROVED</Badge>;
            case "REJECTED":
                return <Badge color="red" variant="filled">REJECTED</Badge>;
            case "PENDING":
                return <Badge color="yellow" variant="filled">PENDING</Badge>;
            default:
                return <Badge color="gray" variant="filled">{status}</Badge>;
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder', textTransform: 'uppercase' }}>
                Loan Management
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text size="xl" weight={700} style={{ marginLeft: '38%', textTransform: 'uppercase', fontWeight: 'bold' }}>Your Loans</Text>
                    <Button
                        variant="gradient"
                        gradient={{ from: '#9d7433', to: '#c9a646' }}
                        size="md"
                        radius="xl"
                        style={{ margin: '20px' }}
                        onClick={() => setLoanModalOpen(true)}
                    >
                        Apply for Loan
                    </Button>
                </div>

                <ScrollArea>
                    <Table withColumnBorders withTableBorder highlightOnHover>
                        <Table.Thead style={{ backgroundColor: '#f5f5f5' }}>
                            <Table.Tr>
                                <Table.Th style={{ textAlign: 'center' }}>Amount</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Term (Months)</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Interest Rate (%)</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Type</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Approved By</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Created Date</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={8} style={{ textAlign: 'center' }}>Loading...</Table.Td>
                                </Table.Tr>
                            ) : loans.length > 0 ? (
                                loans.map((loan, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td style={{ textAlign: 'center' }}>${loan.amount.toFixed(2)}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{loan.termInMonths} months</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{loan.interestRate}%</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{loan.loanType}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{getStatusBadge(loan.status)}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{loan.approvedBy || '-'}</Table.Td>
                                        <Table.Td style={{ textAlign: 'center' }}>{new Date(loan.createdAt).toLocaleString()}</Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={8} style={{ textAlign: 'center' }}>No loans available.</Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card>

            {/* Loan Application Modal */}
            <Modal opened={isLoanModalOpen} onClose={() => setLoanModalOpen(false)} title="Apply for a Loan" centered>
                <NumberInput label="Loan Amount" placeholder="Enter loan amount" value={loanAmount} onChange={setLoanAmount} min={100} />
                <NumberInput label="Term (Months)" placeholder="Enter term" value={termInMonths} onChange={setTermInMonths} min={6} />
                <NumberInput label="Interest Rate (%)" placeholder="Enter interest rate" value={interestRate} onChange={setInterestRate} min={1} />
                <Select label="Loan Type" placeholder="Select loan type" value={loanType} onChange={setLoanType} data={['PERSONAL','VEHICLE', 'BUSINESS','MORTGAGE']} />
                <Button fullWidth mt="md" onClick={handleLoanApplication}>Submit Application</Button>
            </Modal>
        </div>
    );
};

export default CustomerLoansPage;
