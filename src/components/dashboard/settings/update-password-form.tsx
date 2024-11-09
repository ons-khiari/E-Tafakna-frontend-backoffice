'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import axios from 'axios';

export function UpdatePasswordForm(): React.JSX.Element {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Get user data from localStorage and parse it into an object
  const userData = localStorage.getItem('user-data');
  const user = userData ? JSON.parse(userData) : null; // Parse the user data object from localStorage

  // If user is not found in localStorage, show error
  if (!user) {
    return <div>Error: User not found</div>;
  }

  // Get the user ID from the parsed object
  const userId = user.id;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null); // Reset error state
    setLoading(true); // Set loading state to true

    const token = localStorage.getItem('custom-auth-token');
    if (!token) {
      alert('No token found');
      setLoading(false);
      return;
    }

    try {
      // Send password update request using dynamic userId
      const response = await axios.patch(
        `http://localhost:3216/api/auth/update/${userId}`, // Use dynamic userId from user-data
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If update is successful, show success message
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Error updating password');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Confirm password</InputLabel>
              <OutlinedInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>Password updated successfully!</div>}
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
