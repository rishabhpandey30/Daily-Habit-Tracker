import React from 'react';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  return (
    <div className="container auth-page">
      <AuthForm type="register" />
    </div>
  );
};

export default RegisterPage;