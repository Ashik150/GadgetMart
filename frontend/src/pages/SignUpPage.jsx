import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import FloatingShape from "../components/floatingShape";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev); // Toggle password visibility
	};

	return (
		<div className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
			<FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} /> 
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
			>
				<div className='p-8'>
					<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
						Create Account on GadgetMart
					</h2>

					<form onSubmit={handleSignUp}>
						<Input
							icon={User}
							type='text'
							placeholder='Full Name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<Input
							icon={Mail}
							type='email'
							placeholder='Email Address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<div className='relative'>
							<Input
								icon={Lock}
								type={showPassword ? 'text' : 'password'}
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type='button'
								onClick={toggleShowPassword}
								className='absolute right-3 top-3'
							>
								{showPassword ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
							</button>
						</div>
						{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
						<PasswordStrengthMeter password={password} />

						<motion.button
							className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
						</motion.button>
					</form>
				</div>
				<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
					<p className='text-sm text-gray-400'>
						Already have an account?{" "}
						<Link to={"/login"} className='text-green-400 hover:underline'>
							Login
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};
export default SignUpPage;