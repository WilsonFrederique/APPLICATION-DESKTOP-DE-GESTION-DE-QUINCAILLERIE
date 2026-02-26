import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";

const Logo = () => (
  <div className={styles.logoContainer}>
    <div className={styles.logoText}><b>MON LOGO</b></div><br />
    <div className={styles.logoSubtitle}>Gestion de Quincaillerie</div>
  </div>
);

const AuthIllustration = () => (
  <div className={styles.illustrationContainer}>
    <div className={styles.illustrationIcon}>
      <i className="fas fa-store"></i>
    </div>
    <div className={styles.illustrationText}>
      <h3>Gestion & Contrôle</h3>
      <p>Optimisation des stocks et ventes</p>
    </div>
  </div>
);

const Login = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
    });

    const handleSignUpClick = (e) => {
        e.preventDefault();
        setIsSignUpMode(true);
        setError('');
        setSuccess('');
    };

    const handleSignInClick = (e) => {
        e.preventDefault();
        setIsSignUpMode(false);
        setError('');
        setSuccess('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fakeLoginAPI = async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Comptes de test pour la quincaillerie
        if (email === "admin@kandra.com" && password === "admin123") {
            return {
                success: true,
                token: "fake-jwt-token-admin",
                user: {
                    id: 1,
                    email: "admin@kandra.com",
                    nom: "Admin",
                    prenom: "Gestionnaire",
                    role: "admin"
                }
            };
        } else if (email === "vendeur@kandra.com" && password === "vendeur123") {
            return {
                success: true,
                token: "fake-jwt-token-vendeur",
                user: {
                    id: 2,
                    email: "vendeur@kandra.com",
                    nom: "Vendeur",
                    prenom: "Commercial",
                    role: "vendeur"
                }
            };
        } else {
            throw new Error("Email ou mot de passe incorrect");
        }
    };

    const fakeRegisterAPI = async (userData) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (userData.password !== userData.confirmPassword) {
            throw new Error("Les mots de passe ne correspondent pas");
        }
        
        return {
            success: true,
            message: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
            user: {
                id: Math.floor(Math.random() * 1000),
                email: userData.email,
                nom: userData.lastName,
                prenom: userData.firstName,
                role: "vendeur"
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isSignUpMode) {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Les mots de passe ne correspondent pas");
                }

                const response = await fakeRegisterAPI(formData);
                
                setSuccess(response.message);
                setIsSignUpMode(false);
                
                setFormData({
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    confirmPassword: ''
                });

            } else {
                const response = await fakeLoginAPI(formData.email, formData.password);
                
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickLogin = (email, password) => {
        setFormData(prev => ({
            ...prev,
            email,
            password
        }));
        
        setTimeout(() => {
            const form = document.querySelector(`.${styles.signInForm}`);
            if (form) {
                const event = new Event('submit', { bubbles: true });
                form.dispatchEvent(event);
            }
        }, 100);
    };

    useEffect(() => {
        const container = document.querySelector(`.${styles.authContainer}`);
        if (container) {
            if (isSignUpMode) {
                container.classList.add(styles.signUpMode);
            } else {
                container.classList.remove(styles.signUpMode);
            }
        }
    }, [isSignUpMode]);

    return (
        <div className={`${styles.authContainer} ${isSignUpMode ? styles.signUpMode : ""}`}>
            <div className={styles.backgroundShapes}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
                <div className={`${styles.shape} ${styles.shape3}`}></div>
                <div className={`${styles.shape} ${styles.shape4}`}></div>
            </div>

            <div className={styles.authWrapper}>
                <div className={styles.formsSection}>
                    <div className={styles.formsWrapper}>
                        <form 
                            method="POST" 
                            onSubmit={handleSubmit}
                            className={`${styles.authForm} ${styles.signInForm} ${isSignUpMode ? styles.hidden : styles.active}`}
                        >
                            <div className={styles.formHeader}>
                                <Logo />
                                <p className={styles.formSubtitle}>Accédez à votre tableau de bord de gestion</p>
                            </div>

                            <div className={styles.formContent}>
                                {error && (
                                    <div className={styles.alertError}>
                                        <i className="fas fa-exclamation-circle"></i> {error}
                                    </div>
                                )}
                                {success && (
                                    <div className={styles.alertSuccess}>
                                        <i className="fas fa-check-circle"></i> {success}
                                    </div>
                                )}

                                <div className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <MdOutlineEmail className={`${styles.inputIcon}`} />
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Email professionnel"
                                            className={styles.authInput}
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <TbLockPassword className={`${styles.inputIcon}`} />
                                        <input 
                                            type="password" 
                                            name="password" 
                                            placeholder="Mot de passe"
                                            className={styles.authInput}
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formOptions}>
                                    <label className={styles.rememberMe}>
                                        <input type="checkbox" />
                                        Se souvenir de moi
                                    </label>
                                    <a href="#" className={styles.forgotPassword}>Mot de passe oublié ?</a>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`${styles.authBtn} ${styles.primary} ${isLoading ? styles.loading : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className={styles.btnLoader}></div>
                                    ) : (
                                        'Accéder au système'
                                    )}
                                </button>

                                <div className={styles.testAccounts}>
                                    <p className={styles.testTitle}>Accès rapide :</p>
                                    <div className={styles.testButtons}>
                                        <button 
                                            type="button"
                                            className={styles.testBtnAdmin}
                                            onClick={() => handleQuickLogin('admin@kandra.com', 'admin123')}
                                            disabled={isLoading}
                                        >
                                            <i className="fas fa-user-cog"></i> Admin
                                        </button>
                                        <button 
                                            type="button"
                                            className={styles.testBtnVendeur}
                                            onClick={() => handleQuickLogin('vendeur@kandra.com', 'vendeur123')}
                                            disabled={isLoading}
                                        >
                                            <i className="fas fa-user-tie"></i> Vendeur
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formFooter}>
                                <p>Nouveau personnel ? 
                                    <button 
                                        type="button" 
                                        className={styles.switchFormBtn}
                                        onClick={handleSignUpClick}
                                        disabled={isLoading}
                                    >
                                        Demander un compte
                                    </button>
                                </p>
                            </div>
                        </form>

                        <form 
                            onSubmit={handleSubmit}
                            className={`${styles.authForm} ${styles.signUpForm} ${isSignUpMode ? styles.active : styles.hidden}`}
                        >
                            <div className={styles.formHeader}>
                                <Logo />
                                <h2 className={styles.formTitle}>Demande de compte</h2>
                                <p className={styles.formSubtitle}>Pour les nouveaux employés de la quincaillerie</p>
                            </div>

                            <div className={styles.formContent}>
                                {error && (
                                    <div className={styles.alertError}>
                                        <i className="fas fa-exclamation-circle"></i> {error}
                                    </div>
                                )}
                                {success && (
                                    <div className={styles.alertSuccess}>
                                        <i className="fas fa-check-circle"></i> {success}
                                    </div>
                                )}

                                <div className={styles.nameFields}>
                                    <div className={styles.inputGroup}>
                                        <div className={styles.inputWrapper}>
                                            <FaRegUser className={`${styles.inputIcon}`} />
                                            <input 
                                                type="text" 
                                                name="firstName" 
                                                placeholder="Prénom"
                                                className={styles.authInput}
                                                required
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <div className={styles.inputWrapper}>
                                            <FaRegUser className={`${styles.inputIcon}`} />
                                            <input 
                                                type="text" 
                                                name="lastName" 
                                                placeholder="Nom"
                                                className={styles.authInput}
                                                required
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <MdOutlineEmail className={`${styles.inputIcon}`} />
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Email professionnel"
                                            className={styles.authInput}
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <TbLockPassword className={`${styles.inputIcon}`} />
                                        <input 
                                            type="password" 
                                            name="password" 
                                            placeholder="Mot de passe"
                                            className={styles.authInput}
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <TbLockPassword className={`${styles.inputIcon}`} />
                                        <input 
                                            type="password" 
                                            name="confirmPassword" 
                                            placeholder="Confirmer le mot de passe"
                                            className={styles.authInput}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className={styles.termsAgreement}>
                                    <label className={styles.checkboxLabel}>
                                        <input type="checkbox" required />
                                        <span className={styles.checkmark}></span> &nbsp;
                                        <p className={styles.size}>J'accepte les règles internes de la quincaillerie</p>
                                    </label>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`${styles.authBtn} ${styles.primary} ${isLoading ? styles.loading : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className={styles.btnLoader}></div>
                                    ) : (
                                        "Soumettre la demande"
                                    )}
                                </button>
                            </div>

                            <div className={styles.formFooter}>
                                <p>Déjà un compte ? 
                                    <button 
                                        type="button" 
                                        className={styles.switchFormBtn}
                                        onClick={handleSignInClick}
                                        disabled={isLoading}
                                    >
                                        Se connecter
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                <div className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <h1 className={styles.heroTitle}>
                                {isSignUpMode ? 'Demande de compte' : 'Gestion de Quincaillerie'}
                            </h1>
                            <p className={styles.heroDescription}>
                                {isSignUpMode 
                                    ? 'Système complet de gestion de quincaillerie : stocks, ventes, facturation et reporting.'
                                    : 'Gérez votre quincaillerie efficacement avec notre système intégré de gestion de stocks et ventes.'
                                }
                            </p>
                        </div>
                        
                        <div className={styles.heroVisual}>
                            <AuthIllustration />
                        </div>

                        <button 
                            className={`${styles.authBtn} ${styles.outline} ${styles.switchModeBtn}`}
                            onClick={isSignUpMode ? handleSignInClick : handleSignUpClick}
                            disabled={isLoading}
                        >
                            {isSignUpMode ? 'Se connecter' : 'Demander un compte'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;