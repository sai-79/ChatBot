
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
  // Use state to manage the visibility of the pop-up
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationPopup(false);

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
      console.log({ isError, error, needsEmailVerification }); // Debugging line
      if (error) {
        setError(error);
        if (error.status === 409)
        {
          setEmailAlreadyExists(true);
        }
      } else {
        // Show the pop-up instead of just setting the state
         setShowVerificationPopup(true);
      } 
      
       
      
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleClosePopup = () => {
    if (emailAlreadyExists) {
      setEmailAlreadyExists(false);
    } else {
      setShowVerificationPopup(false);
    }
    navigate('/sign-in');
  };

  return (
    <>
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
        </div>

        <p className={styles.text}>
          Already have an account?{' '}
          <Link to="/sign-in" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>

      {/* Conditionally render the popup */}
      {showVerificationPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Verify your email</h3>
              <button className={styles.modalCloseButton} onClick={handleClosePopup}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Please check your email to verify your account before signing in.</p>
              <button className={styles.modalButton} onClick={handleClosePopup}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
      {emailAlreadyExists && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Email already exists</h3>
              <button className={styles.modalCloseButton} onClick={handleClosePopup}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>An account with this email already exists. Please verify the email or sign in instead.</p>
              <button className={styles.modalButton} onClick={handleClosePopup}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default SignUp;
