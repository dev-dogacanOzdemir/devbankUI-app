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
    NumberInput,
    Select
} from '@mantine/core';

interface Loan {
    _id: string;
    customerId: string;
    amount: number;
    termInMonths: number;
    interestRate: number;
    loanType: string;
    status: string;
    createdAt: string;
}

const AdminLoanPage: React.FC = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [formData, setFormData] = useState({
        amount: 0,
        termInMonths: 0,
        interestRate: 0,
        loanType: '',
        status: '',
    });

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await fetch('http://localhost:2006/api/loans');
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }
                const data: Loan[] = await response.json();
                setLoans(data || []);
            } catch (error) {
                console.error('Error fetching loans:', error);
            }
        };
        fetchLoans();
    }, []);

    const handleEdit = (loan: Loan) => {
        setSelectedLoan(loan);
        setFormData({ ...loan });
        setIsModalOpen(true);
    };

    const handleChange = (field: keyof Loan, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleApproveLoan = async (loan: Loan) => {
        console.log("Approving Loan:", loan);

        const loanId = loan.loanId || loan._id; // _id veya loanId'yi kontrol et

        if (!loanId) {
            console.error("Loan ID is undefined!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:2006/api/loans/${loanId}/approve`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            console.log("Loan approved successfully!");
            updateLoanStatus(loanId, "APPROVED");
        } catch (error) {
            console.error("Error approving loan:", error);
        }
    };

    const handleRejectLoan = async (loan: Loan) => {
        console.log("Rejecting Loan:", loan);

        const loanId = loan.loanId || loan._id;

        if (!loanId) {
            console.error("Loan ID is undefined!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:2006/api/loans/${loanId}/reject`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            console.log("Loan rejected successfully!");
            updateLoanStatus(loanId, "REJECTED");
        } catch (error) {
            console.error("Error rejecting loan:", error);
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedLoan) return;

        const loanId = selectedLoan.loanId || selectedLoan._id;

        if (!loanId) {
            console.error("Loan ID is undefined!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:2006/api/loans/${loanId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedLoan = await response.json();
                setLoans((prevLoans) =>
                    prevLoans.map((loan) => (loan.loanId === updatedLoan.loanId ? updatedLoan : loan))
                );
                setIsModalOpen(false);
            } else {
                console.error('Failed to update loan');
            }
        } catch (error) {
            console.error('Error updating loan:', error);
        }
    };

// Loan Durumunu Güncelleyen Fonksiyon
    const updateLoanStatus = (loanId: string, newStatus: string) => {
        setLoans((prevLoans) =>
            prevLoans.map((loan) =>
                (loan.loanId || loan._id) === loanId ? { ...loan, status: newStatus } : loan
            )
        );
    };


    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Text size="30px" mb="xl" mt="sm" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Loan Management
            </Text>
            <Divider mt="sm" size="sm" />
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <ScrollArea>
                    <Table withColumnBorders withTableBorder highlightOnHover>
                        <Table.Thead style={{ backgroundColor: '#f5f5f5' }}>
                            <Table.Tr>
                                <Table.Th>Customer ID</Table.Th>
                                <Table.Th>Amount</Table.Th>
                                <Table.Th>Term (Months)</Table.Th>
                                <Table.Th>Interest Rate (%)</Table.Th>
                                <Table.Th>Loan Type</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created At</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loans.map((loan) => (
                                <Table.Tr key={loan.loanId}>
                                    <Table.Td>{loan.customerId}</Table.Td>
                                    <Table.Td>{loan.amount.toFixed(2)}</Table.Td>
                                    <Table.Td>{loan.termInMonths}</Table.Td>
                                    <Table.Td>{loan.interestRate.toFixed(2)}</Table.Td>
                                    <Table.Td>{loan.loanType}</Table.Td>
                                    <Table.Td>
                                        <Badge color={loan.status === 'APPROVED' ? 'green' : loan.status === 'REJECTED' ? 'red' : 'yellow'}>
                                            {loan.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>{new Date(loan.createdAt).toLocaleDateString('en-GB')}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        <Badge
                                            color="#4f86a6"
                                            variant="filled"
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleEdit(loan)}
                                        >
                                            EDIT
                                        </Badge>

                                        {loan.status === "PENDING" && (
                                            <>
                                                <Badge
                                                    color="green"
                                                    variant="filled"
                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => handleApproveLoan({...loan, _id: loan.loanId || loan._id})}
                                                >
                                                    APPROVE
                                                </Badge>

                                                <Badge
                                                    color="#c04e4e"
                                                    variant="filled"
                                                    style={{ cursor: 'pointer' }}
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => handleRejectLoan({...loan, _id: loan.loanId || loan._id})}
                                                >
                                                    REJECT
                                                </Badge>
                                            </>
                                        )}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card>

            <Modal opened={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Loan" size="lg">
                <NumberInput label="Amount" value={formData.amount} onChange={(value) => handleChange('amount', value || 0)} mb="md" />
                <NumberInput label="Term (Months)" value={formData.termInMonths} onChange={(value) => handleChange('termInMonths', value || 0)} mb="md" />
                <NumberInput label="Interest Rate (%)" value={formData.interestRate} onChange={(value) => handleChange('interestRate', value || 0)} precision={2} mb="md" />
                <Select label="Loan Type" value={formData.loanType} onChange={(value) => handleChange('loanType', value || '')} data={['PERSONAL', 'MORTGAGE', 'BUSINESS']} mb="md" />
                <Button color="#34a890" fullWidth mt="md" onClick={handleSaveChanges}>Save Changes</Button>
            </Modal>
        </div>
    );
};

export default AdminLoanPage;
