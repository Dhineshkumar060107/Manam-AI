// import React, { useState } from 'react';
// import { auth } from '../services/firebase';
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// interface LoginPageProps {
//   navigateToHome: () => void;
// }

// export const LoginPage: React.FC<LoginPageProps> = ({ navigateToHome }) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleGoogleSignIn = async () => {
//         setIsLoading(true);
//         setError('');
//         const provider = new GoogleAuthProvider();
//         try {
//             await signInWithPopup(auth, provider);
//             // Navigation will be handled by the onAuthStateChanged listener in App.tsx
//         } catch (error) {
//             console.error("Google Sign-In failed:", error);
//             setError("Failed to sign in with Google. Please try again.");
//             setIsLoading(false);
//         }
//     };
    
//     const handleEmailLogin = (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("Email/Password login is not yet implemented.");
//     }

//     return (
//         <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans">
//              <div className="absolute top-6 left-6">
//                 <button onClick={navigateToHome} className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                     <span>Home</span>
//                 </button>
//             </div>
//             <div className="w-full max-w-md">
//                 <div className="text-center mb-8">
//                      <div className="inline-flex items-center justify-center space-x-3 mb-4">
//                         <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                             <span className="text-2xl font-bold text-white">M</span>
//                         </div>
//                         <h1 className="text-3xl font-bold text-white">MANAM</h1>
//                     </div>
//                     <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
//                     <p className="text-gray-400">Sign in to continue your wellness journey.</p>
//                 </div>

//                 <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
//                     <form className="space-y-6" onSubmit={handleEmailLogin}>
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
//                                 Email Address
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 required
//                                 placeholder="you@example.com"
//                                 className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 required
//                                 placeholder="••••••••"
//                                 className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                             />
//                         </div>
//                         <div className="text-right">
//                              <a href="#" className="text-sm text-blue-400 hover:underline">Forgot Password?</a>
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                             Login
//                         </button>
//                     </form>
                    
//                     <div className="my-6 flex items-center">
//                         <div className="flex-grow border-t border-gray-600"></div>
//                         <span className="mx-4 text-gray-500 text-sm">OR</span>
//                         <div className="flex-grow border-t border-gray-600"></div>
//                     </div>

//                     <div className="space-y-3">
//                          <button 
//                             onClick={handleGoogleSignIn}
//                             disabled={isLoading}
//                             className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             {isLoading ? 'Signing in...' : 'Continue with Google'}
//                         </button>
//                          <button disabled className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50">
//                             Continue with Apple
//                         </button>
//                     </div>
//                     {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
//                 </div>
//                 <p className="text-center text-sm text-gray-500 mt-6">
//                     Don't have an account? <a href="#" className="text-blue-400 hover:underline">Sign Up</a>
//                 </p>
//             </div>
//         </div>
//     );
// };
import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginPageProps {
  navigateToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigateToHome }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false); // toggle between login & signup

  // form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google Sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Navigation handled in App.tsx via onAuthStateChanged
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  // Email/Password Auth
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignup) {
        // Signup new user
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Login existing user
        await signInWithEmailAndPassword(auth, email, password);
      }
      // navigation handled by App.tsx
    } catch (error: any) {
      console.error("Auth failed:", error);
      setError(error.message || "Authentication failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="absolute top-6 left-6">
        <button
          onClick={navigateToHome}
          className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Home</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
            <h1 className="text-3xl font-bold text-white">MANAM</h1>
          </div>
          <h2 className="text-2xl font-bold text-white">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-gray-400">
            {isSignup ? 'Sign up to start your wellness journey.' : 'Sign in to continue your wellness journey.'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            {!isSignup && (
              <div className="text-right">
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* Google Sign-in */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
            <button
              disabled
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Continue with Apple
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </div>

        {/* Toggle */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsSignup(false)} className="text-blue-400 hover:underline">
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button onClick={() => setIsSignup(true)} className="text-blue-400 hover:underline">
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
