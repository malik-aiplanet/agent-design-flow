import { useState, useMemo } from "react";
import { Plus, Search, Filter, Edit, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TerminationConfigurationDrawer } from "@/components/drawers/TerminationConfigurationDrawer";
import { useTerminations, useDeleteTermination } from "@/hooks/useTerminations";
import { Termination2 } from "@/types/termination";

const TerminationsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTermination, setSelectedTermination] = useState<Termination2 | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Query parameters for backend filtering
  const queryParams = useMemo(() => ({
    name_like: searchTerm || undefined,
    limit: 100,
  }), [searchTerm]);

  // Fetch terminations from backend
  const {
    data: terminationsResponse,
    isLoading,
    error,
    refetch
  } = useTerminations(queryParams);

  // Delete mutation
  const deleteTerminationMutation = useDeleteTermination();

  const terminations = (terminationsResponse as any)?.items || [];

  // Filter terminations by search term
  const filteredTerminations = terminations.filter(termination => {
    const searchLower = searchTerm.toLowerCase();
    return termination.name.toLowerCase().includes(searchLower) ||
           termination.description.toLowerCase().includes(searchLower) ||
           termination.terminationType.toLowerCase().includes(searchLower);
  });

  const handleCardClick = (termination: Termination2) => {
    setSelectedTermination(termination);
    setDrawerOpen(true);
  };

  const handleAddNew = () => {
    setSelectedTermination(null);
    setDrawerOpen(true);
  };

  const handleDelete = (terminationId: string) => {
    deleteTerminationMutation.mutate({ id: terminationId, permanent: false });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Loading termination conditions...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="text-red-600 text-xl font-semibold mb-3">Error loading termination conditions</div>
          <p className="text-slate-400 mb-8 text-base">{(error as any)?.message || 'Something went wrong'}</p>
          <Button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto rounded-lg font-semibold text-base"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Termination Conditions</h1>
            <p className="text-slate-600 text-lg">Manage and configure termination conditions for your agents</p>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white h-auto flex items-center gap-3 font-semibold transition-colors rounded-lg py-[10px] px-[16px] text-sm"
          >
            <Plus className="h-5 w-5" />
            Add New Termination Condition
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            placeholder="Search termination conditions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-12 h-14 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerminations.map(termination => (
          <Card
            key={termination.id}
            className="hover:shadow-lg transition-all duration-300 bg-white border-slate-200 border-2 overflow-hidden cursor-pointer hover:border-blue-300 group h-fit"
            onClick={() => handleCardClick(termination)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {termination.name}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 border-blue-200 border font-semibold px-2 py-1 text-xs ml-2 flex-shrink-0 rounded">
                    {termination.terminationType}
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{termination.description}</p>

                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>Last modified {termination.lastModified}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-2" onClick={e => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 border border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-semibold text-xs flex-1"
                    onClick={() => handleCardClick(termination)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(termination.id)}
                        disabled={deleteTerminationMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deleteTerminationMutation.isPending ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTerminations.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-200">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <div className="text-slate-500 text-xl font-semibold mb-3">No termination conditions found</div>
          <p className="text-slate-400 mb-8 text-base">Try adjusting your search terms or create your first termination condition</p>
          <Button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto rounded-lg font-semibold text-base"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Termination Condition
          </Button>
        </div>
      )}

      <TerminationConfigurationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        termination={selectedTermination}
      />
    </div>
  );
};

export default TerminationsManagement;
