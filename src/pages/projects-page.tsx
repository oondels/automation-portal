import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  Filter,
  Grid,
  Loader2,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useProjects } from "../context/projects-context";
import { Project, ProjectStatus, ProjectUrgency } from "../types";
import { formatDate } from "../lib/utils";
import { statuses, sectors, urgencies } from "../data/mockData";

export function ProjectsPage() {
  const { projects } = useProjects();
  const [view, setView] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<ProjectUrgency | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter projects based on search term and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesSector = sectorFilter === "all" || project.sector === sectorFilter;
    const matchesUrgency = urgencyFilter === "all" || project.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesSector && matchesUrgency;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSectorFilter("all");
    setUrgencyFilter("all");
  };

  // Get urgency icon
  const getUrgencyIcon = (urgency: ProjectUrgency) => {
    switch (urgency) {
      case "high":
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Minus className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: ProjectStatus) => {
    const statusInfo = statuses[status];
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Browse and manage automation project requests
          </p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Link to="/new-request">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Project Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full md:w-auto"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {(statusFilter !== "all" || sectorFilter !== "all" || urgencyFilter !== "all") && (
                  <Badge variant="secondary\" className="ml-2">
                    {[
                      statusFilter !== "all",
                      sectorFilter !== "all",
                      urgencyFilter !== "all"
                    ].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant={view === "table" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("table")}
                >
                  <Activity className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap gap-4">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as ProjectStatus | "all")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.entries(statuses).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={sectorFilter}
                      onValueChange={(value) => setSectorFilter(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sectors</SelectItem>
                        {sectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.name}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={urgencyFilter}
                      onValueChange={(value) => setUrgencyFilter(value as ProjectUrgency | "all")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Urgencies</SelectItem>
                        {Object.entries(urgencies).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {(statusFilter !== "all" || sectorFilter !== "all" || urgencyFilter !== "all") && (
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="h-10"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : view === "table" ? (
            <div className="relative overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Project Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Sector
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Urgency
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Start Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Est. End Date
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {project.name}
                      </td>
                      <td className="p-4 align-middle">{project.sector}</td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {getUrgencyIcon(project.urgency)}
                          <span className="capitalize">{project.urgency}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {project.startDate ? formatDate(project.startDate) : "-"}
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(project.estimatedEndDate)}
                      </td>
                      <td className="p-4 text-right align-middle">
                        <Link to={`/projects/${project.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.sector}
                          </p>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          {getUrgencyIcon(project.urgency)}
                          <span className="capitalize">{project.urgency} Urgency</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Due {formatDate(project.estimatedEndDate)}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link to={`/projects/${project.id}`}>
                          <Button className="w-full" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}