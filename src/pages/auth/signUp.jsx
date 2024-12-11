import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider } from '../../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchRoles, updateUserData } from '../../utils/utils';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '../../context/authContext';

function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    organizationName: ''
  });
  const { fetchUserInfo } = useAuth();

  useEffect(() => {
    fetchRoles(setRoles);
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.role) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive"
      });
      return false;
    } 
    if (!formData.organizationName) {
      toast({
        title: "Error",
        description: "Please enter your organization name",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      try {
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });

        await updateUserData({
          user_id: userCredential.user.uid,
          role_id: formData.role,
          name: formData.name,
          email: formData.email,
          organization_name: formData.organizationName
        });

        await fetchUserInfo(userCredential.user.uid);

        toast({
          title: "Success",
          description: "Account created successfully",
        });
        navigate('/home');
      } catch (error) {
        await deleteUser(userCredential.user);
        throw error;
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!formData.role) {
      toast({
        title: "Error",
        description: "Please select a role before signing in with Google",
        variant: "destructive"
      });
      return;
    } 
    if (!formData.organizationName) {
      toast({
        title: "Error",
        description: "Please enter your organization name",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      
      await updateUserData({
        user_id: result.user.uid,
        role_id: formData.role,
        name: result.user.displayName,
        email: result.user.email,
        organization_name: formData.organizationName
      });

      toast({
        title: "Success",
        description: "Signed in successfully with Google",
      });
      navigate('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value
    });
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
          >
            Sign Up
          </Button>
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-black/50"
            variant="secondary"
          >
            Sign Up with Google
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-600 hover:underline text-sm">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup; 