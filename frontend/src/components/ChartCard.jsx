import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useTheme } from "../context/ThemeContext.jsx";
import EmptyState from "./EmptyState.jsx";

const chartColors = ["#1769e0", "#23a6d5", "#69b3ff", "#8bc6ec", "#1256b0", "#5c7cfa"];

const getCategoryColor = (categoryName = "") => {
  const colorIndex = Array.from(categoryName).reduce((total, letter) => total + letter.charCodeAt(0), 0) % chartColors.length;
  return chartColors[colorIndex];
};

function ChartCard({ title, type, data }) {
  const { isDarkMode } = useTheme();
  const hasData = Array.isArray(data) && data.length > 0;
  const total = hasData ? data.reduce((sum, item) => sum + Number(item.value || 0), 0) : 0;
  const axisColor = isDarkMode ? "#9fb1ca" : "#6c7d94";
  const gridColor = isDarkMode ? "#223452" : "#e4edf9";
  const tooltipStyle = {
    background: isDarkMode ? "#101a2b" : "#ffffff",
    border: `1px solid ${isDarkMode ? "#263a5c" : "#dbe7f8"}`,
    borderRadius: "12px",
    color: isDarkMode ? "#e8f0ff" : "#172033"
  };

  return (
    <section className="chart-card">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>

      {!hasData ? (
        <EmptyState title="Not enough data yet" message="Add a few expenses to unlock this visualization." />
      ) : type === "pie" ? (
        <div className="donut-layout">
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={3}>
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={getCategoryColor(entry.name || String(index))} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`INR ${Number(value).toFixed(2)}`, "Spending"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            {data.map((item, index) => {
              const percentage = total > 0 ? (Number(item.value || 0) / total) * 100 : 0;

              return (
                <div className="legend-row" key={item.name}>
                  <span className="legend-color" style={{ background: getCategoryColor(item.name || String(index)) }} />
                  <span className="legend-name">{item.name}</span>
                  <strong>INR {Number(item.value || 0).toFixed(2)}</strong>
                  <em>{percentage.toFixed(1)}%</em>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="chart-frame">
          <ResponsiveContainer width="100%" height={280}>
            {type === "area" ? (
              <ComposedChart data={data}>
                <defs>
                  <linearGradient id="monthlyTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1769e0" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#1769e0" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: axisColor }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`INR ${Number(value).toFixed(2)}`, "Spending"]} />
                <Area type="monotone" dataKey="value" stroke="#1769e0" fill="url(#monthlyTrend)" strokeWidth={3} />
                <Line type="monotone" dataKey="value" stroke="#0f58c2" strokeWidth={2} dot={false} />
              </ComposedChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: axisColor }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`INR ${Number(value).toFixed(2)}`, "Spending"]} />
                <Bar dataKey="value" fill="#1769e0" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ChartCard;
