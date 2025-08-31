import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {  Stack,  TextField, IconButton, InputAdornment,  Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../Iconify';
import { register } from '../../services/auth';

import useResponsive from '../../theme/hooks/useResponsive';

import {Link} from '@mui/material';

// import { Link as RouterLink } from 'react-router-dom';
// import {FormControlLabel} from '@mui/material';
// import {Checkbox} from '@mui/material';
// ----------------------------------------------------------------------

export default function RegisterForm() {

  const smUp = useResponsive('up', 'sm');

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(" ");

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    emailId: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
    .min(8, 'Password should be 8 characters minimum'),
    userName: Yup.string().required('User Name is required')
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      emailId: '',
      password: '',
      remember: true,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      //User Register Service call - Upon success user is redirected to dashboard 
      //Register fail snackbar displays error
      await register(values, setShowAlert, setAlertMessage)
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
    {!smUp &&
    <Snackbar
      open={showAlert}
      autoHideDuration={6000}
       >
         <Alert severity="error" sx={{ width: '100%' }}>
         {alertMessage}
        </Alert>
      </Snackbar>
    }
        <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {smUp && showAlert && (
              <Alert severity="error" sx={{ width: '100%' }}>
              {alertMessage}
             </Alert>
            )}

            <TextField
              name="userName"
              fullWidth
              type="text"
              label="UserName"
              {...getFieldProps('userName')}
              error={Boolean(touched.userName && errors.userName)}
              helperText={touched.userName && errors.userName} />

             
            

            <TextField
              name="emailId"
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('emailId')}
              error={Boolean(touched.emailId && errors.emailId)}
              helperText={touched.emailId && errors.emailId} />

            <TextField
              name="password"
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password} />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
          </Stack>

          {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="Remember me" />

            <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
              Forgot password?
            </Link>
          </Stack> */}

          
        </Form>
      </FormikProvider></>
  );
}
