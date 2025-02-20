
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface UsageChartProps {
  data: {
    date: string;
    runs: number;
  }[];
  timeRange: "day" | "week" | "month" | "year";
}

const UsageChart = ({ data, timeRange }: UsageChartProps) => {
  const getXAxisFormatter = () => {
    switch (timeRange) {
      case "day":
        return (value: string) => format(new Date(value), "HH:mm");
      case "week":
        return (value: string) => format(new Date(value), "EEE");
      case "month":
        return (value: string) => format(new Date(value), "MMM d");
      case "year":
        return (value: string) => format(new Date(value), "MMM");
      default:
        return (value: string) => format(new Date(value), "MMM d");
    }
  };

  const getTooltipFormatter = () => {
    switch (timeRange) {
      case "day":
        return (value: string) => format(new Date(value), "HH:mm");
      case "week":
      case "month":
        return (value: string) => format(new Date(value), "MMM d, yyyy");
      case "year":
        return (value: string) => format(new Date(value), "MMMM yyyy");
      default:
        return (value: string) => format(new Date(value), "MMM d, yyyy");
    }
  };

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            tickFormatter={getXAxisFormatter()}
          />
          <YAxis stroke="#888888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
            }}
            labelFormatter={getTooltipFormatter()}
            formatter={(value: number) => [`${value} runs`, "Runs"]}
          />
          <Bar
            dataKey="runs"
            fill="#2ed573"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
