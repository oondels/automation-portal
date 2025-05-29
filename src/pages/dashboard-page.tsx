import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  Clock, 
  Filter, 
  Loader2, 
  Minus, 
  Users, 
  AlertTriangle,
  Calendar
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useProjects } from "../context/projects-context";
import { Project, ProjectStatus, ProjectUrgency } from "../types";
import { formatDate } from "../lib/utils";
import { statuses, sectors, urgencies } from "../data/mockData";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Pie, PieChart } from "recharts";

export function DashboardPage() {
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<ProjectUrgency | "all">("all");

  // Calculate key metrics
  const totalRequests = projects.length;
  const pendingApproval = projects.filter(p => p.status === "requested").length;
  const inProgress = projects.filter(p => p.status === "in_progress").length;
  const approvedNotStarted = projects.filter(p => p.status === "approved").length;
  const teamMembers = 3; // Mock value - replace with actual team size
  const requestsPerMember = totalRequests > 0 ? (inProgress / teamMembers).toFixed(1) : 0;
  const isOverloaded = Number(requestsPerMember) > 3; // Threshold of 3 projects per team member

  // Status distribution for donut chart
  const statusData = Object.entries(statuses).map(([key, { label }]) => ({
    name: label,
    value: projects.filter(p => p.status === key).length
  }));

  // Weekly requests data (mock data - replace with actual data)
  const weeklyData = [
    { week: "Week 1", requests: 5 },
    { week: "Week 2", requests: 8 },
    { week: "Week 3", requests: 12 },
    { week: "Week 4", requests: 7 },
    { week: "Week 5", requests: 15 },
    { week: "Week 6", requests: 10 }
  ];

  // Backlog trend data (mock data - replace with actual data)
  const backlogData = [
    { month: "Jan", backlog: 10 },
    { month: "Feb", backlog: 15 },
    { month: "Mar", backlog: 25 },
    { month: "Apr", backlog: 30 },
    { month: "May", backlog: 40 },
    { month: "Jun", backlog: 45 }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#6b7280'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Management Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor automation project requests and team capacity
          </p>
        </div>
        <Link to="/new-request">
          <Button>New Project Request</Button>
        </Link>
      </motion.div>

      {isOverloaded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border-l-4 border-warning bg-warning/10 p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <p className="text-sm text-warning">
              Alert: Team is currently overloaded with {requestsPerMember} projects per team member
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                All automation project requests
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApproval}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review and approval
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Load</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requestsPerMember}</div>
              <p className="text-xs text-muted-foreground">
                Active projects per team member
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>
              Current state of all automation requests
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Request Trend</CardTitle>
            <CardDescription>
              New automation requests per week
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="hsl(var(--primary))">
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backlog Growth Trend</CardTitle>
          <CardDescription>
            Cumulative project backlog over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={backlogData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="backlog" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Capacity Overview</CardTitle>
          <CardDescription>
            Current resource allocation and capacity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Team Members</p>
                <p className="text-2xl font-bold">{teamMembers}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Active Projects</p>
                <p className="text-2xl font-bold">{inProgress}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Projects per Member</p>
                <p className="text-2xl font-bold">{requestsPerMember}</p>
              </div>
            </div>
            
            <div className="h-3 rounded-full bg-muted">
              <div 
                className={`h-3 rounded-full transition-all ${
                  isOverloaded ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ 
                  width: `${Math.min((Number(requestsPerMember) / 3) * 100, 100)}%` 
                }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              {isOverloaded 
                ? "Team is over capacity. Consider adding more resources."
                : "Team capacity is within acceptable limits."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}