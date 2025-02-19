
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface UsageChartProps {
  data: {
    date: string;
    usage: number;
  }[];
}

const UsageChart = ({ data }: UsageChartProps) => {
  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            tickFormatter={(value) => format(new Date(value), "MMM d")}
          />
          <YAxis stroke="#888888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
            }}
            labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
          />
          <Line
            type="monotone"
            dataKey="usage"
            stroke="#2ed573"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
