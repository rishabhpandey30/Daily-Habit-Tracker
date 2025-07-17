import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <div className="container auth-page">
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage;