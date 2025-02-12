
import { BarChart2, CreditCard, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", runs: 4 },
  { name: "Tue", runs: 7 },
  { name: "Wed", runs: 5 },
  { name: "Thu", runs: 6 },
  { name: "Fri", runs: 8 },
  { name: "Sat", runs: 3 },
  { name: "Sun", runs: 2 },
];

const runs = [
  {
    id: 1,
    date: "2024-02-20",
    status: "Completed",
    credits: 1,
    workflow: "Email Processing",
  },
  {
    id: 2,
    date: "2024-02-19",
    status: "Completed",
    credits: 1,
    workflow: "Data Import",
  },
  {
    id: 3,
    date: "2024-02-18",
    status: "Completed",
    credits: 1,
    workflow: "File Conversion",
  },
];

const Dashboard = () => {
  return (
    <div className="container py-24">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Next credit renewal in 8 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <div className="flex items-center text-xs text-emerald-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              12% from last week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="flex items-center text-xs text-red-500">
              <ArrowDown className="h-3 w-3 mr-1" />
              4% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Run Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              className="w-full h-full"
              config={{
                runs: {
                  color: "#9b87f5",
                },
              }}
            >
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <ChartLegend />
                <Bar
                  dataKey="runs"
                  fill="var(--color-runs)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Runs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credits Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>{run.date}</TableCell>
                  <TableCell>{run.workflow}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {run.status}
                    </span>
                  </TableCell>
                  <TableCell>{run.credits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
