
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
import { Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Run {
  id: string;
  created_at: string;
  company_name: string;
  credits_used: number;
  google_drive?: string | null;
}

interface RunsTableProps {
  runs: Run[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const RunsTable = ({ runs, searchQuery, onSearchChange }: RunsTableProps) => {
  const filteredRuns = runs.filter(run => 
    run.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search company name..."
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
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRuns.map((run) => (
            <TableRow key={run.id}>
              <TableCell>{format(new Date(run.created_at), "MMM d, yyyy")}</TableCell>
              <TableCell>{run.company_name}</TableCell>
              <TableCell>{run.credits_used}</TableCell>
              <TableCell>
                {run.google_drive ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-primary"
                    onClick={() => window.open(run.google_drive!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RunsTable;
