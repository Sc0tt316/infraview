import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, RefreshCw, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { userService } from '@/services/userService';
import { toast } from '@/hooks/use-toast';
import { useUsersRealtime } from '@/hooks/useUsersRealtime';
import { hasPermission } from '@/utils/permissions';

// Define the form schema for adding users
const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email("Invalid email address."),
  role: z.enum(["admin", "user", "manager"]),
  department: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."
  })
});

// Define the form schema for editing users (removed status, added password)
const editUserFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email("Invalid email address."),
  role: z.enum(["admin", "user", "manager"]),
  department: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."
  }).optional()
});

type UserFormValues = z.infer<typeof userFormSchema>;
type EditUserFormValues = z.infer<typeof editUserFormSchema>;

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [showUserAddModal, setShowUserAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const canManageUsers = hasPermission(user, 'manage_users');
  const {
    users,
    isLoading,
    refetch,
    filterUsersByRole,
    searchUsers
  } = useUsersRealtime();

  // Apply filters whenever search query, role filter, or users data changes
  useEffect(() => {
    const roleFiltered = filterUsersByRole(roleFilter);
    const result = searchUsers(searchQuery, roleFiltered);
    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users, filterUsersByRole, searchUsers]);

  const fetchUserLogs = async (userId: string) => {
    try {
      const logs = [{
        id: '1',
        action: 'Login',
        timestamp: new Date().toISOString(),
        details: 'User logged in successfully'
      }, {
        id: '2',
        action: 'Print job',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        details: 'User submitted print job "Document.pdf"'
      }, {
        id: '3',
        action: 'Password changed',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        details: 'User changed their password'
      }];
      setUserLogs(logs);
    } catch (error) {
      console.error('Error fetching user logs:', error);
      setUserLogs([]);
    }
  };

  const handleRowClick = (userRow: User) => {
    setSelectedUser(userRow);
    fetchUserLogs(userRow.id);
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setTimeout(() => {
      setSelectedUser(null);
      setUserLogs([]);
    }, 300);
  };

  const handleAddUser = () => {
    if (!canManageUsers) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add users.",
        variant: "destructive"
      });
      return;
    }
    setShowUserAddModal(true);
  };

  const handleEditUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedUser && canManageUsers) {
      setShowEditModal(true);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !canManageUsers) return;

    // Prevent admin from deleting their own account
    if (selectedUser.id === user?.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account.",
        variant: "destructive"
      });
      return;
    }
    try {
      const success = await userService.deleteUser(selectedUser.id);
      if (success) {
        // Close the dialog and refresh the data
        setShowUserDetails(false);
        setSelectedUser(null);
        setUserLogs([]);
        // Force refresh of users list
        await refetch();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Form for adding a new user
  const addUserForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      department: "",
      phone: "+212 ",
      password: ""
    }
  });

  // Form for editing an existing user
  const editUserForm = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      role: selectedUser?.role as "admin" | "user" | "manager" || "user",
      department: selectedUser?.department || "",
      phone: selectedUser?.phone || "",
      password: ""
    }
  });

  // Reset edit form values when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      editUserForm.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        department: selectedUser.department || "",
        phone: selectedUser.phone || "",
        password: ""
      });
    }
  }, [selectedUser, editUserForm]);

  // Handle adding a new user
  const onAddUserSubmit = async (data: UserFormValues) => {
    try {
      const newUser = await userService.addUser(data);
      if (newUser) {
        toast({
          title: "Success",
          description: "User added successfully"
        });
        setShowUserAddModal(false);
        addUserForm.reset({
          name: "",
          email: "",
          role: "user",
          department: "",
          phone: "+212 ",
          password: ""
        });
        // Force refresh of users list
        await refetch();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive"
      });
    }
  };

  // Handle editing an existing user
  const onEditUserSubmit = async (data: EditUserFormValues) => {
    if (!selectedUser) return;
    try {
      const updatedUser = await userService.updateUser(selectedUser.id, data);
      if (updatedUser) {
        toast({
          title: "Success",
          description: "User updated successfully"
        });
        setShowEditModal(false);
        setShowUserDetails(false);
        setSelectedUser(null);
        // Force refresh of users list
        await refetch();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  // Render user status badge with appropriate styling
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Active
          </Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            Inactive
          </Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            Pending
          </Badge>;
      default:
        return <Badge variant="outline">
            {status || 'Unknown'}
          </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          {canManageUsers && (
            <Button onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" /> Add User
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found. Adjust your search or filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(userRow => (
                  <TableRow key={userRow.id} className="cursor-pointer hover:bg-muted/70" onClick={() => handleRowClick(userRow)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {userRow.profileImage ? (
                            <AvatarImage src={userRow.profileImage} alt={userRow.name} />
                          ) : (
                            <AvatarFallback>
                              {userRow.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span>{userRow.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{userRow.email}</TableCell>
                    <TableCell>
                      <Badge variant={userRow.role === 'admin' ? 'default' : 'secondary'}>
                        {userRow.role === 'admin' ? 'Admin' : userRow.role === 'manager' ? 'Manager' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(userRow.status || 'active')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <Dialog open={showUserDetails} onOpenChange={handleCloseUserDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                View detailed information about this user.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-20 w-20">
                  {selectedUser.profileImage ? (
                    <AvatarImage src={selectedUser.profileImage} alt={selectedUser.name} />
                  ) : (
                    <AvatarFallback className="text-xl">
                      {selectedUser.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
                <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'} className="text-sm">
                  {selectedUser.role === 'admin' ? 'Administrator' : selectedUser.role === 'manager' ? 'Manager' : 'Standard User'}
                </Badge>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                {selectedUser.department && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span>{selectedUser.department}</span>
                  </div>
                )}
                {selectedUser.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{selectedUser.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {renderStatusBadge(selectedUser.status || 'active')}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                {userLogs.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {userLogs.map(log => (
                      <div key={log.id} className="p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{log.action}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border rounded-md text-muted-foreground">
                    No recent activity found for this user.
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseUserDetails}>
                  Close
                </Button>
                {canManageUsers && (
                  <>
                    <Button onClick={handleEditUser}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User
                    </Button>
                    {selectedUser.id !== user?.id && (
                      <Button variant="destructive" onClick={handleDeleteUser}>
                        Delete User
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add User Modal */}
      <Dialog open={showUserAddModal} onOpenChange={setShowUserAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Form {...addUserForm}>
              <form className="space-y-4" onSubmit={addUserForm.handleSubmit(onAddUserSubmit)}>
                <FormField control={addUserForm.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={addUserForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={addUserForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={addUserForm.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={addUserForm.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Department (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={addUserForm.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+212 6XX XXX XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => setShowUserAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add User
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and change password
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Form {...editUserForm}>
              <form className="space-y-4" onSubmit={editUserForm.handleSubmit(onEditUserSubmit)}>
                <FormField control={editUserForm.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={editUserForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={editUserForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (Optional)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password to change" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={editUserForm.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={editUserForm.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Department (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={editUserForm.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
