import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ResetPassword: React.FC = () => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const { token } = useParams<{ token: string | undefined }>();
	const navigate = useNavigate();
	const { resetPassword } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
			return;
		}
		try {
			if (token) {
			await resetPassword(token, password);
			}
			setMessage('Password reset successful');
			setTimeout(() => navigate('/login'), 3000);
		} catch (error) {
			console.error('Password reset failed:', error);
			setMessage('Failed to reset password. Please try again.');
		}
	};

	return (
		<div className="reset-password">
			<h2>Reset Password</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="password">New Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword">Confirm Password:</label>
					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Reset Password</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default ResetPassword;
