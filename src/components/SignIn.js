import styles from '../styles/components/SignIn.module.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNhostClient } from '@nhost/react';
import Input from './Input';



const SignIn = () => {
  const nhost = useNhostClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { isError, error, session, user } = await nhost.auth.signIn({
        email: email.trim(),
        password
      });

      

      if (isError) {
        setError(error);
      } else if (!session) {
        setError({ message: 'No session returned. Check email verification.' });
      } else {
        console.log("Sign in successful, session:", session);
        navigate('/');
      }
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles['logo-wrapper']}>
          <img src={process.env.PUBLIC_URL + 'logo.svg'} alt="logo" />
        </div>

        <form onSubmit={handleOnSubmit} className={styles.form}>
          <Input
            type="email"
            label="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {error && (
          <div className={styles.error}>
            {error?.message || 'Invalid credentials. Please try again.'}
          </div>
        )}
      </div>

      <p className={styles.text}>
        No account yet?{' '}
        <Link to="/sign-up" className={styles.link}>
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
