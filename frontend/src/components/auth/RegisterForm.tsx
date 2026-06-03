import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validateRequired, validateMinLength } from '../../utils/validators';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const firstNameError = validateRequired(formData.first_name, 'First name');
    if (firstNameError) {
      setError(firstNameError);
      return;
    }
    const lastNameError = validateRequired(formData.last_name, 'Last name');
    if (lastNameError) {
      setError(lastNameError);
      return;
    }
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }
    const passwordError = validateMinLength(formData.password, 8, 'Password');
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      onSuccess();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(axiosError.response?.data?.message || axiosError.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.first_name}
          onChange={handleChange('first_name')}
          placeholder="John"
          required
        />
        <Input
          label="Last Name"
          value={formData.last_name}
          onChange={handleChange('last_name')}
          placeholder="Doe"
          required
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        placeholder="At least 8 characters"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        placeholder="Repeat your password"
        required
      />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account
      </Button>
    </form>
  );
};