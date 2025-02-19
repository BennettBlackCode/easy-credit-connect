
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Search } from "lucide-react";

interface Run {
  id: string;
  created_at: string;
  company_name: string;
  credits_used: number;
}

interface RunsTableProps {
  runs: Run[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const RunsTable = ({ runs, searchQuery, onSearchChange }: RunsTableProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search runs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Credits Used</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell>{format(new Date(run.created_at), "MMM d, yyyy")}</TableCell>
              <TableCell>{run.company_name}</TableCell>
              <TableCell>{run.credits_used}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RunsTable;
