import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore';

interface LoginFormData {
   email: string;
   password: string;
}

function LoginPage() {
   const [showPassword, setShowPassword] = useState<boolean>(false);
   const [formData, setFormData] = useState<LoginFormData>({
      email: 'emma.thompson@example.com',
      password: '123456'
   });

   const { login, isLoggingIn } = useAuthStore();

   const validateForm = () => {
      if (!formData.email.trim()) {
         toast.error('Email is required');
         return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
         toast.error('Invalid email format');
         return false;
      }
      if (!formData.password) {
         toast.error('Password is required');
         return false;
      }
      if (formData.password.length < 6) {
         toast.error('Password must be at least 6 characters');
         return false;
      }
      return true;
   };

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateForm()) login(formData);
   };

   return (
      <div className="grid min-h-screen pt-16 lg:grid-cols-2">
         {/* Left Side */}
         <div className="flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
               {/* Logo */}
               <div className="mb-8 text-center">
                  <div className="group flex flex-col items-center gap-2">
                     <div className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                        <MessageSquare className="text-primary h-6 w-6" />
                     </div>
                     <h1 className="mt-2 text-2xl font-bold">Welcome Back</h1>
                     <p className="text-base-content/60">Sign in to your account</p>
                  </div>
               </div>

               {/* Form */}
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field*/}
                  <div className="form-control">
                     <label className="label">
                        <span className="label-text font-medium">Email</span>
                     </label>
                     <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                           <Mail className="text-base-content/40 h-5 w-5" />
                        </div>
                        <input
                           type="email"
                           name="email"
                           className={`input input-bordered w-full pl-10`}
                           placeholder="you@example.com"
                           value={formData.email}
                           onChange={handleChange}
                        />
                     </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-control">
                     <label className="label">
                        <span className="label-text font-medium">Password</span>
                     </label>
                     <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                           <Lock className="text-base-content/40 h-5 w-5" />
                        </div>
                        <input
                           type={showPassword ? 'text' : 'password'}
                           name="password"
                           className={`input input-bordered w-full pl-10`}
                           placeholder="••••••••"
                           value={formData.password}
                           onChange={handleChange}
                        />
                        <button
                           type="button"
                           className="absolute inset-y-0 right-0 flex items-center pr-3"
                           onClick={() => setShowPassword(!showPassword)}
                        >
                           {showPassword ? <EyeOff className="text-base-content/40 h-5 w-5" /> : <Eye className="text-base-content/40 h-5 w-5" />}
                        </button>
                     </div>
                  </div>

                  {/* Button submit */}
                  <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                     {isLoggingIn ? (
                        <>
                           <Loader2 className="h-5 w-5 animate-spin" />
                           Loading...
                        </>
                     ) : (
                        'Sign in'
                     )}
                  </button>
               </form>

               <div className="text-center">
                  <p className="text-base-content/60">
                     Don&apos;t have an account?{' '}
                     <Link to="/signup" className="link link-primary">
                        Create account
                     </Link>
                  </p>
               </div>
            </div>
         </div>

         {/* Right Side - Image/Pattern */}
         <AuthImagePattern title={'Welcome back!'} subtitle={'Sign in to continue your conversations and catch up with your messages.'} />
      </div>
   );
}

export default LoginPage;
