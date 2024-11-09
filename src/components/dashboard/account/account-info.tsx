'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';

export function AccountInfo(): React.JSX.Element {
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // Store the selected image file
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch user profile (same as your current useEffect)
  React.useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('custom-auth-token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3216/api/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUserProfile(response.data);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      }
    };

    fetchProfile();
  }, []);

  // Handle the file input change (when user selects an image)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file); // Save the selected file to state
    }
  };

  // Handle image upload and profile update when the button is clicked
  const handleUpload = async () => {
    if (!imageFile) {
      alert('Please select an image to upload');
      return;
    }

    const token = localStorage.getItem('custom-auth-token');
    if (!token) {
      alert('No token found');
      return;
    }

    setLoading(true); // Set loading state to true to indicate a process is happening

    const formData = new FormData();
    formData.append('image', imageFile); // Append the image file to FormData

    try {
      // Step 1: Upload the image to get the download URL
      const uploadResponse = await axios.post('http://localhost:3216/api/image/uploadimage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const downloadURL = uploadResponse.data.downloadURL[0];
      const updateResponse = await axios.patch(
        'http://localhost:3216/api/profile/update',
        {
          avatar: downloadURL,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updateResponse.data) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          {userProfile ? (
            <>
              <div>
                <Avatar src={userProfile.avatar || ''} sx={{ height: '80px', width: '80px' }} />
              </div>

              <Stack spacing={1} sx={{ textAlign: 'center' }}>
                <Typography variant="h5">
                  {userProfile.firstName} {userProfile.lastName}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {userProfile.state}, {userProfile.city}, {userProfile.country}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {userProfile.bio}
                </Typography>
              </Stack>
            </>
          ) : (
            <Typography color="text.secondary" variant="body2">
              Loading profile...
            </Typography>
          )}
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        {/* Button to select the image */}
        <Button fullWidth variant="text" component="label">
          Upload picture
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange} // Handle file selection
          />
        </Button>
        {/* Button to save and update the avatar */}
        <Button onClick={handleUpload} variant="contained" fullWidth>
          Save avatar
        </Button>
      </CardActions>
    </Card>
  );
}
