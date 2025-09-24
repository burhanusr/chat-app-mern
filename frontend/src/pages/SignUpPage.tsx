import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore';

interface SignupFormData {
   fullName: string;
   email: string;
   password: string;
}

function SignUpPage() {
   const [showPassword, setShowPassword] = useState<boolean>(false);
   const [formData, setFormData] = useState<SignupFormData>({
      fullName: '',
      email: '',
      password: ''
   });
   const { signup, isSigningUp } = useAuthStore();

   const validateForm = () => {
      if (!formData.fullName.trim()) {
         toast.error('Full name is required');
         return false;
      }
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

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateForm()) signup(formData);
   };

   return (
      <div className="grid min-h-screen pt-14 lg:grid-cols-2">
         {/* left side */}
         <div className="flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
               {/* LOGO */}
               <div className="mb-8 text-center">
                  <div className="group flex flex-col items-center gap-2">
                     <div className="size-20">
                        <img src="/logo.svg" />
                     </div>
                     <h1 className="mt-2 text-2xl font-bold">Create Account</h1>
                     <p className="text-base-content/60">Get started with your free account</p>
                  </div>
               </div>

               {/* Form */}
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Fullname Field */}
                  <div className="form-control">
                     <label className="label">
                        <span className="label-text font-medium">Full Name</span>
                     </label>
                     <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                           <User className="text-base-content/40 size-5" />
                        </div>
                        <input
                           type="text"
                           name="fullName"
                           className={`input input-bordered w-full pl-10`}
                           placeholder="John Doe"
                           value={formData.fullName}
                           onChange={handleChange}
                        />
                     </div>
                  </div>

                  {/* Email Field */}
                  <div className="form-control">
                     <label className="label">
                        <span className="label-text font-medium">Email</span>
                     </label>
                     <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                           <Mail className="text-base-content/40 size-5" />
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
                           <Lock className="text-base-content/40 size-5" />
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
                           {showPassword ? <EyeOff className="text-base-content/40 size-5" /> : <Eye className="text-base-content/40 size-5" />}
                        </button>
                     </div>
                  </div>

                  {/* Button Submit */}
                  <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                     {isSigningUp ? (
                        <>
                           <Loader2 className="size-5 animate-spin" />
                           Loading...
                        </>
                     ) : (
                        'Create Account'
                     )}
                  </button>
               </form>

               <div className="text-center">
                  <p className="text-base-content/60">
                     Already have an account?{' '}
                     <Link to="/login" className="link link-primary">
                        Sign in
                     </Link>
                  </p>
               </div>
            </div>
         </div>

         {/* right side */}

         <AuthImagePattern title="Join our community" subtitle="Connect with friends, share moments, and stay in touch with your loved ones." />
      </div>
   );
}

export default SignUpPage;
