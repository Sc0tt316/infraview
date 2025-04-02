
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Users as UsersIcon, UserPlus, Search, Filter, MoreHorizontal, 
  Mail, Phone, Shield, ShieldAlert, ShieldCheck, Edit, Trash2, RefreshCw, 
  Check, X, AlertTriangle, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService, UserData } from "@/services/userService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "user",
    password: "" // New field for admin to set password
  });
  
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  
  // Fetch users with React Query
  const { data: users = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers
  });
  
  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: (data: Omit<UserData, 'id' | 'lastActive'> & { password: string }) => 
      userService.addUserWithPassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowAddDialog(false);
      resetForm();
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserData> }) => 
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowEditDialog(false);
      setSelectedUser(null);
      resetForm();
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  // Change user status mutation
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserData['status'] }) => 
      userService.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      role: "user",
      password: ""
    });
    setIsSubmitting(false);
  };
  
  // Handle add user submission
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { name, email, phone, department, role, password } = formData;
    
    if (!name || !email || !department || !password) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }
    
    const newUser = {
      name,
      email,
      phone,
      department,
      role: role as UserData['role'],
      status: "active" as const,
      password
    };
    
    addUserMutation.mutate(newUser);
  };
  
  // Handle edit user submission
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    setIsSubmitting(true);
    
    const { name, email, phone, department, role } = formData;
    
    if (!name || !email || !department) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }
    
    updateUserMutation.mutate({
      id: selectedUser.id,
      data: { name, email, phone, department, role: role as UserData['role'] }
    });
  };
  
  // Open edit dialog with selected user data
  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      role: user.role,
      password: "" // We don't edit password here, but keep the field in state
    });
    setShowEditDialog(true);
  };
  
  // Handle delete user
  const handleDeleteUser = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };
  
  // Handle status change
  const handleStatusChange = (id: string, status: UserData['status']) => {
    changeStatusMutation.mutate({ id, status });
  };
  
  // Get filtered users based on search and tabs
  const getFilteredUsers = () => {
    let filtered = users;
    
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

  // If user is not admin, show restricted access message
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Restricted Access</h3>
        <p className="text-muted-foreground mt-1 max-w-md">
          You need administrator privileges to access the user management page.
        </p>
      </div>
    );
  }

  // Fix for dialog not closing
  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
    resetForm();
  };

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setSelectedUser(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user access and permissions</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()} 
            className="h-10 w-10"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          
          <Dialog open={showAddDialog} onOpenChange={handleCloseAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus size={16} />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name*</label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">Email*</label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium">Password*</label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password for new user" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="department" className="text-sm font-medium">Department*</label>
                    <Input 
                      id="department" 
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Enter department" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="role" className="text-sm font-medium">Role*</label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => handleSelectChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseAddDialog}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showEditDialog} onOpenChange={handleCloseEditDialog}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-name" className="text-sm font-medium">Full Name*</label>
                    <Input 
                      id="edit-name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-email" className="text-sm font-medium">Email*</label>
                    <Input 
                      id="edit-email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-phone" className="text-sm font-medium">Phone</label>
                    <Input 
                      id="edit-phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-department" className="text-sm font-medium">Department*</label>
                    <Input 
                      id="edit-department" 
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Enter department" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-role" className="text-sm font-medium">Role*</label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => handleSelectChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseEditDialog}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="manager">Managers</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : isError ? (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load users. Please try again.
            <Button variant="outline" size="sm" className="ml-2" onClick={() => refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : filteredUsers.length > 0 ? (
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
              className="bg-white dark:bg-gray-800 border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-4"
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
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      
                      {user.status === "inactive" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          <span>Set active</span>
                        </DropdownMenuItem>
                      )}
                      
                      {user.status === "active" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                          <X className="mr-2 h-4 w-4 text-gray-600" />
                          <span>Set inactive</span>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            No users match your search criteria. Try changing your search or filters.
          </p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedTab("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Users;
