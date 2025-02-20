
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

  const getNumberOfTicks = () => {
    if (window.innerWidth < 640) {
      switch (timeRange) {
        case "day":
          return 6;
        case "week":
          return 3;
        case "month":
          return 4;
        case "year":
          return 4;
        default:
          return 4;
      }
    }
    return undefined;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        margin={{ 
          top: 20,
          right: 20,
          left: 0,
          bottom: 20 
        }}
      >
        <XAxis 
          dataKey="date" 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={getXAxisFormatter()}
          interval="preserveStartEnd"
          minTickGap={15}
          tickCount={getNumberOfTicks()}
          style={{ fill: 'rgba(255, 255, 255, 0.65)' }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          width={35}
          style={{ fill: 'rgba(255, 255, 255, 0.65)' }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "8px 12px",
          }}
          labelFormatter={getTooltipFormatter()}
          formatter={(value: number) => [`${value} runs`, "Runs"]}
        />
        <Bar
          dataKey="runs"
          fill="#2ed573"
          opacity={1}
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UsageChart;
