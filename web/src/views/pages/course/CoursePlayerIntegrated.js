
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CoursePlayerIntegrated = ({ course }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Course Player
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: 400,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1
        }}
      >
        <Typography variant="body1" color="textSecondary">
          Video player component for: {course?.title || 'Course Content'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CoursePlayerIntegrated;