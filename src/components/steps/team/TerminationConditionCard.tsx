
import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTerminations } from "@/hooks/useTerminations";

export const TerminationConditionCard = () => {
  const [selectedTerminationId, setSelectedTerminationId] = useState("");

  // Fetch termination conditions from backend
  const { data: terminationsResponse, isLoading } = useTerminations({ limit: 100 });
  const terminations = (terminationsResponse as any)?.items || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          Termination Condition
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Loading conditions...</span>
          </div>
        ) : (
          <Select value={selectedTerminationId} onValueChange={setSelectedTerminationId}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {terminations.map(termination => (
                <SelectItem key={termination.id} value={termination.id}>
                  {termination.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
};
