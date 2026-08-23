import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useState, type FormEvent } from "react";
import { login } from "../api/auth.api";

export default function LoginPage() {
	const navigate = useNavigate();

	const setAuth = useAuthStore((state) => state.setAuth);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setError('');
		setLoading(true);

		try {
			const response: any = await login({
				email,
				password
			});

			setAuth(response.user, response.accessToken, response.refreshToken);

			navigate('/', {
				replace: true
			});

		} catch (error) {
			setError('Invalid email or password.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
			<div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
				<h1 className="mb-2 text-2xl font-bold">
					Welcome back
				</h1>

				<p className="mb-6 text-sm text-gray-500">
					Login to your ShopSphere account.
				</p>

				{error && (<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>)}

				<form onSubmit={(handleSubmit)} className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium">Email</label>
						<input type="email" value={email} onChange={(event) => { setEmail(event.target.value) }} />
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">Password</label>
						<input type="password" value={password} onChange={(event) => { setPassword(event.target.value) }} required className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2" />
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50">

						{loading ? "Logging in..." : "Login"}
					</button>

				</form>

				<p className="mt-6 text-center text-sm text-gray-500">
					Don't have an account? {' '}
					<Link to="/register" className="font-medium text-black">Create account</Link>
				</p>
			</div>
		</div>
	)



}