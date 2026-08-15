import AppLayout from "../components/AppLayout.jsx";
import ChartCard from "../components/ChartCard.jsx";
import DataPanel from "../components/DataPanel.jsx";
import EmptyState from "../components/EmptyState.jsx";
import InsightCard from "../components/InsightCard.jsx";
import QuickActions from "../components/QuickActions.jsx";
import Skeleton from "../components/Skeleton.jsx";
import StatCard from "../components/StatCard.jsx";
import Table from "../components/Table.jsx";
import { useMemo } from "react";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { formatMoney, formatMonth } from "../utils/formatters.js";

function Dashboard() {
  const {
    summary,
    recentExpenses,
    categorySpending,
    monthlySpending,
    isLoading,
    isRefreshing,
    error,
    refreshDashboard
  } = useDashboardData();

  const categoryChartData = useMemo(
    () =>
      categorySpending.map((item) => ({
        name: item.category,
        value: Number(item.totalSpending || 0)
      })),
    [categorySpending]
  );

  const monthlyChartData = useMemo(
    () =>
      monthlySpending.map((item) => ({
        label: formatMonth(item.year, item.month),
        value: Number(item.totalSpending || 0),
        year: item.year,
        month: item.month
      })),
    [monthlySpending]
  );

  const insights = useMemo(() => {
    const highestCategory = categoryChartData.reduce(
      (highest, item) => (item.value > highest.value ? item : highest),
      { name: "None yet", value: 0 }
    );
    const now = new Date();
    const currentMonth = monthlyChartData.find(
      (item) => Number(item.year) === now.getFullYear() && Number(item.month) === now.getMonth() + 1
    );

    return {
      highestCategory,
      currentMonthSpending: currentMonth?.value || 0
    };
  }, [categoryChartData, monthlyChartData]);

  return (
    <AppLayout eyebrow="Analytics" title="ExpenseFlow Dashboard" subtitle="A clear view of spending, trends, and recent activity.">
        {error && <div className="alert alert-error dashboard-alert">{error}</div>}

        {isLoading ? (
          <Skeleton rows={6} />
        ) : (
          <>
            <div className="stats-grid">
              <StatCard label="Total Expenses" value={summary.totalExpenses ?? 0} icon="T" />
              <StatCard label="Total Spending" value={formatMoney(summary.totalSpending)} icon="$" />
              <StatCard label="Average Expense" value={formatMoney(summary.averageExpense)} icon="AVG" />
              <StatCard label="Highest Expense" value={formatMoney(summary.highestExpense)} icon="MAX" />
            </div>

            <div className="analytics-grid">
              <ChartCard title="Category Spending" type="pie" data={categoryChartData} />
              <ChartCard title="Monthly Spending" type="bar" data={monthlyChartData} />
              <ChartCard title="Monthly Expense Trend" type="area" data={monthlyChartData} />
              <QuickActions onRefresh={() => refreshDashboard(false)} isRefreshing={isRefreshing} />
            </div>

            <div className="insights-grid">
              <InsightCard
                label="Highest spending category"
                value={insights.highestCategory.name}
                helper={formatMoney(insights.highestCategory.value)}
              />
              <InsightCard label="Current month's spending" value={formatMoney(insights.currentMonthSpending)} />
              <InsightCard label="Recorded expenses" value={summary.totalExpenses ?? 0} />
              <InsightCard label="Average expense" value={formatMoney(summary.averageExpense)} />
              <InsightCard label="Highest expense" value={formatMoney(summary.highestExpense)} />
            </div>

            <div className="dashboard-grid recent-dashboard-grid">
              <DataPanel title="Recent Expenses">
                <div id="recent-expenses">
                  <Table columns={["Title", "Category", "Amount", "Date"]}>
                      {recentExpenses.length > 0 ? (
                        recentExpenses.map((expense) => (
                          <tr key={expense.id}>
                            <td>{expense.title}</td>
                            <td>{expense.category}</td>
                            <td>{formatMoney(expense.amount)}</td>
                            <td>{expense.date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="empty-cell">
                            No recent expenses yet.
                          </td>
                        </tr>
                      )}
                  </Table>
                </div>
              </DataPanel>

              <DataPanel title="Category Spending">
                <div className="spending-list">
                  {categorySpending.length > 0 ? (
                    categorySpending.map((item) => (
                      <div className="spending-row" key={item.category}>
                        <span>{item.category}</span>
                        <strong>{formatMoney(item.totalSpending)}</strong>
                      </div>
                    ))
                  ) : (
                    <EmptyState title="No categories yet" message="Category spending will appear after expenses are added." />
                  )}
                </div>
              </DataPanel>

              <DataPanel title="Monthly Spending">
                <div className="spending-list">
                  {monthlySpending.length > 0 ? (
                    monthlySpending.map((item) => (
                      <div className="spending-row" key={`${item.year}-${item.month}`}>
                        <span>{formatMonth(item.year, item.month)}</span>
                        <strong>{formatMoney(item.totalSpending)}</strong>
                      </div>
                    ))
                  ) : (
                    <EmptyState title="No monthly totals yet" message="Monthly spending will appear after expenses are added." />
                  )}
                </div>
              </DataPanel>
            </div>
          </>
        )}
    </AppLayout>
  );
}

export default Dashboard;
