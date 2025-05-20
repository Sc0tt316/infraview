import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const {
    user
  } = useAuth();
  const isAdmin = user?.role === 'admin';
  const {
    data: users = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers
  });

  // Apply filters whenever search query, role filter, or users data changes
  useEffect(() => {
    let result = [...users];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query));
    }
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };
  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          
          
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          {isAdmin && <Button onClick={() => toast("Add user functionality is not implemented yet")}>
              <Plus className="h-4 w-4 mr-2" /> Add User
            </Button>}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <p className="text-muted-foreground">
            View and manage user accounts
          </p>
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

          {isLoading ? <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
            </div> : filteredUsers.length === 0 ? <div className="text-center py-8 text-muted-foreground">
              No users found. Adjust your search or filters.
            </div> : <Table>
              
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {user.profileImage ? <AvatarImage src={user.profileImage} alt={user.name} /> : <AvatarFallback>
                              {user.name?.charAt(0) || 'U'}
                            </AvatarFallback>}
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : user.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}>
                        {user.status === 'active' ? 'Active' : user.status === 'inactive' ? 'Inactive' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" onClick={() => handleViewUser(user)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>}
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && <Dialog open={showUserDetails} onOpenChange={handleCloseUserDetails}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                View detailed information about this user.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-20 w-20">
                  {selectedUser.profileImage ? <AvatarImage src={selectedUser.profileImage} alt={selectedUser.name} /> : <AvatarFallback className="text-xl">
                      {selectedUser.name?.charAt(0) || 'U'}
                    </AvatarFallback>}
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono">{selectedUser.id}</span>
                </div>
                {selectedUser.department && <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span>{selectedUser.department}</span>
                  </div>}
                {selectedUser.phone && <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{selectedUser.phone}</span>
                  </div>}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className={selectedUser.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : selectedUser.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}>
                    {selectedUser.status === 'active' ? 'Active' : selectedUser.status === 'inactive' ? 'Inactive' : 'Pending'}
                  </Badge>
                </div>
                {selectedUser.lastActive && <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Active:</span>
                    <span>{new Date(selectedUser.lastActive).toLocaleDateString()}</span>
                  </div>}
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseUserDetails}>
                  Close
                </Button>
                {isAdmin && <Button onClick={() => toast("Edit user functionality is not implemented yet")}>
                    Edit User
                  </Button>}
              </div>
            </div>
          </DialogContent>
        </Dialog>}
    </div>;
};
export default Users;