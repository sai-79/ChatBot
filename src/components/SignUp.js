import styles from '../styles/components/SignUp.module.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNhostClient } from '@nhost/react';
import Input from './Input';

const SignUp = () => {
  const nhost = useNhostClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNeedsEmailVerification(false);

    const trimmedEmail = email.trim();
    try {
      const { isError, error, needsEmailVerification } = await nhost.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          displayName: `${firstName} ${lastName}`.trim(),
          metadata: { firstName, lastName }
        }
      });

      if (isError) {
        setError(error);
      } else if (needsEmailVerification) {
        setNeedsEmailVerification(true);
      } else {
        navigate('/sign-in');
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
          <div className={styles['input-group']}>
            <Input
              label="First name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <Input
            type="email"
            label="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Create password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            {error?.message || 'Something went wrong. Please try again.'}
          </div>
        )}
        {needsEmailVerification && (
          <div className={styles.info}>
            Please check your email to verify your account before signing in.
          </div>
        )}
      </div>

      <p className={styles.text}>
        Already have an account?{' '}
        <Link to="/sign-in" className={styles.link}>
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
