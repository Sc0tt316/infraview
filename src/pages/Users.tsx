
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, UserPlus, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { UserData } from '@/types/user';
import { userService } from '@/services/userService';
import { Badge } from '@/components/ui/badge';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'manager',
    department: '',
    phone: '',
    password: '',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  const { user: loggedInUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return userService.getAllUsers();
    },
  });

  const addUserMutation = useMutation({
    mutationFn: (userData: typeof newUser) => {
      return userService.addUserWithPassword({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        phone: userData.phone,
        status: userData.status,
        password: userData.password
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Added",
        description: `User ${newUser.name} has been added successfully.`,
      });
      handleCloseAddUserModal();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });

  useEffect(() => {
    if (users) {
      let filtered = users;

      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(user =>
          user.name.toLowerCase().includes(lowerSearchTerm) ||
          user.email.toLowerCase().includes(lowerSearchTerm) ||
          user.department?.toLowerCase().includes(lowerSearchTerm)
        );
      }

      if (roleFilter !== 'all') {
        filtered = filtered.filter(user => user.role === roleFilter);
      }

      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, roleFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
  };

  const handleOpenAddUserModal = () => {
    setShowAddUserModal(true);
    setShowPassword(false);
  };

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      department: '',
      phone: '',
      password: '',
      status: 'active'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: 'admin' | 'user' | 'manager') => {
    setNewUser(prevUser => ({
      ...prevUser,
      role: value,
    }));
  };

  const handleStatusChange = (value: 'active' | 'inactive' | 'pending') => {
    setNewUser(prevUser => ({
      ...prevUser,
      status: value,
    }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUserMutation.mutate(newUser);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isAdmin = loggedInUser?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-muted-foreground mt-1">Manage your system users</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="icon"
            className="h-10 w-10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {isAdmin && (
            <Button onClick={handleOpenAddUserModal}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-md"
          />
          <Search className="w-4 h-4 ml-2 text-muted-foreground" />
        </div>

        <Select onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'N/A'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <PlusCircle className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}

      <Dialog open={showAddUserModal} onOpenChange={handleCloseAddUserModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select onValueChange={(value: any) => handleRoleChange(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select onValueChange={(value: any) => handleStatusChange(value)} defaultValue="active">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Input
                  type="text"
                  id="department"
                  name="department"
                  value={newUser.department}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="relative col-span-3">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" type="button" onClick={handleCloseAddUserModal}>
                Cancel
              </Button>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
