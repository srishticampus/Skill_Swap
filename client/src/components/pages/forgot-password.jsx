
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Invalid email format');
        return;
    }
    // In a real application, you would send a request to your backend here
    // to initiate the password reset process. For example:
    // try {
    //   const response = await fetch('/api/forgot-password', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email }),
    //   });

    //   if (response.ok) {
    //     setEmailSent(true);
    //   } else {
    //     const errorData = await response.json();
    //     setError(errorData.message || 'Failed to send reset instructions.');
    //   }
    // } catch (error) {
    //   setError('Failed to connect to the server.');
    // }
    setEmailSent(true); // For demonstration purposes, assume success
  };

  if (emailSent) {
    return (
      <main className="container mx-3 flex flex-col items-center gap-4 my-20">
        <h1 className="text-center text-primary text-3xl">Password Reset</h1>
        <p className='max-w-prose'>If an account exists with that email, we've sent password reset instructions to your inbox.</p>
      </main>
    );
  }

  return (
    <main className="container mx-3 flex flex-col items-center gap-4 my-20">
      <h1 className="text-center text-primary text-3xl">Forgot Password</h1>
      <p className="text-center max-w-prose">Enter your E-mail below to receive your password reset instructions.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 w-[80%] max-w-[400px]">
        <label htmlFor="email" className="flex flex-col">
          <span>Email</span>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {error && <span className="text-red-500">{error}</span>}
        <Button type="submit">Reset Password</Button>
      </form>
    </main>
  );
}
