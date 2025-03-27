
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Users, UserPlus, Search, Filter, MoreHorizontal, Mail, Phone, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "manager";
  department: string;
  status: "active" | "inactive";
  lastActive: string;
  avatar?: string;
}

const MOCK_USERS: UserData[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    email: "alex.johnson@printerverse.com",
    phone: "+1 (555) 123-4567",
    role: "admin",
    department: "IT",
    status: "active",
    lastActive: "2 minutes ago",
  },
  {
    id: "u2",
    name: "Sarah Miller",
    email: "sarah.miller@printerverse.com",
    phone: "+1 (555) 234-5678",
    role: "user",
    department: "Marketing",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: "u3",
    name: "Michael Chen",
    email: "michael.chen@printerverse.com",
    phone: "+1 (555) 345-6789",
    role: "manager",
    department: "Operations",
    status: "inactive",
    lastActive: "3 days ago",
  },
  {
    id: "u4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@printerverse.com",
    phone: "+1 (555) 456-7890",
    role: "user",
    department: "HR",
    status: "active",
    lastActive: "4 hours ago",
  },
  {
    id: "u5",
    name: "James Wilson",
    email: "james.wilson@printerverse.com",
    phone: "+1 (555) 567-8901",
    role: "manager",
    department: "Finance",
    status: "active",
    lastActive: "Yesterday",
  },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const getFilteredUsers = () => {
    let filtered = MOCK_USERS;
    
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedTab !== "all") {
      filtered = filtered.filter(user => {
        if (selectedTab === "active" || selectedTab === "inactive") {
          return user.status === selectedTab;
        }
        return user.role === selectedTab;
      });
    }
    
    return filtered;
  };

  const getRoleBadge = (role: UserData["role"]) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 gap-1">
            <ShieldAlert size={12} />
            <span>Admin</span>
          </Badge>
        );
      case "manager":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1">
            <ShieldCheck size={12} />
            <span>Manager</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
            <Shield size={12} />
            <span>User</span>
          </Badge>
        );
    }
  };

  const getStatusColor = (status: UserData["status"]) => {
    return status === "active" 
      ? "text-green-600" 
      : "text-gray-600";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user access and permissions</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus size={16} />
              <span>Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="department" className="text-sm font-medium">Department</label>
                <Input id="department" placeholder="Enter department" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <select id="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={() => setShowAddDialog(false)}>Add User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          
          <Tabs defaultValue="all" className="w-fit" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="manager">Managers</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <motion.div 
        className="space-y-4"
        variants={staggerVariants}
        initial="hidden"
        animate="show"
      >
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            variants={itemVariants}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-white border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{user.name}</h3>
                    <span className={cn("text-xs", getStatusColor(user.status))}>
                      •
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.department}</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getRoleBadge(user.role)}
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="md:hidden mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Users;
