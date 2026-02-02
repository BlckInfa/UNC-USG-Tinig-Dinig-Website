import { Card } from '../../../components';
import './FinanceDashboard.css';

/**
 * Finance Dashboard - Finance Feature
 */
const FinanceDashboard = () => {
  const summaryData = [
    { label: 'Total Budget', value: '₱500,000.00', trend: 'neutral' },
    { label: 'Total Income', value: '₱125,000.00', trend: 'up' },
    { label: 'Total Expenses', value: '₱89,500.00', trend: 'down' },
    { label: 'Balance', value: '₱535,500.00', trend: 'up' },
  ];

  const recentTransactions = [
    { id: 1, description: 'Event Sponsorship', amount: 15000, type: 'income', date: '2024-01-15' },
    { id: 2, description: 'Office Supplies', amount: -2500, type: 'expense', date: '2024-01-14' },
    { id: 3, description: 'Membership Fees', amount: 5000, type: 'income', date: '2024-01-13' },
    { id: 4, description: 'Marketing Materials', amount: -3500, type: 'expense', date: '2024-01-12' },
  ];

  return (
    <div className="finance-dashboard">
      <div className="finance-header">
        <h2>Financial Overview</h2>
        <button className="add-transaction-btn">+ Add Transaction</button>
      </div>

      <div className="summary-cards">
        {summaryData.map((item, index) => (
          <Card key={index} className="summary-card">
            <span className="summary-label">{item.label}</span>
            <span className={`summary-value ${item.trend}`}>{item.value}</span>
          </Card>
        ))}
      </div>

      <Card title="Recent Transactions" className="transactions-card">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>{transaction.date}</td>
                <td>
                  <span className={`type-badge ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className={transaction.amount >= 0 ? 'positive' : 'negative'}>
                  {transaction.amount >= 0 ? '+' : ''}₱{Math.abs(transaction.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
