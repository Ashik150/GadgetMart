import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import FloatingShape from "../components/floatingShape";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev); // Toggle password visibility
	};

	const toggleShowConfirmPassword = () => {
		setShowConfirmPassword((prev) => !prev); // Toggle password visibility
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
				className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
			>
				<div className='p-8'>
					<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
						Reset Password
					</h2>
					{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
					{message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

					<form onSubmit={handleSubmit}>
						<div className='relative'>
							<Input
								icon={Lock}
								type={showPassword ? "text" : "password"}
								placeholder='New Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type='button'
								onClick={toggleShowPassword}
								className='absolute right-3 top-3'
							>
								{showPassword ? <EyeOff className='w-5 h-5 text-white' /> : <Eye className='w-5 h-5 text-white' />}
							</button>
						</div>

						<div className='relative'>
							<Input
								icon={Lock}
								type={showConfirmPassword ? "text" : "password"}
								placeholder='Confirm Password'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
							<button
								type='button'
								onClick={toggleShowConfirmPassword}
								className='absolute right-3 top-3'
							>
								{showConfirmPassword ? <EyeOff className='w-5 h-5 text-white' /> : <Eye className='w-5 h-5 text-white' />}
							</button>
						</div>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? "Resetting..." : "Set New Password"}
						</motion.button>
					</form>
				</div>
			</motion.div>
		</div>
	);
};
export default ResetPasswordPage;