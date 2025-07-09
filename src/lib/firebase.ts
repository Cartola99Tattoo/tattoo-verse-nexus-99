
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Declaração das variáveis globais obrigatórias
declare global {
  var __app_id: string;
  var __firebase_config: any;
  var __initial_auth_token: string;
}

// Configuração Firebase usando as variáveis globais
const getFirebaseConfig = () => {
  // Se as variáveis globais não estiverem definidas, usar configuração padrão para desenvolvimento
  if (typeof window !== 'undefined' && window.__firebase_config) {
    return window.__firebase_config;
  }
  
  // Configuração padrão para desenvolvimento local
  return {
    apiKey: "demo-api-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id"
  };
};

const getAppId = () => {
  if (typeof window !== 'undefined' && window.__app_id) {
    return window.__app_id;
  }
  return "default-app-id";
};

// Inicializar Firebase
const app = initializeApp(getFirebaseConfig());
export const db = getFirestore(app);
export const auth = getAuth(app);

// Se estamos em desenvolvimento, conectar ao emulador
if (process.env.NODE_ENV === 'development' && !('_delegate' in db)) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // Emulador já conectado
  }
}

// Função para autenticar usuário
export const authenticateUser = async (): Promise<boolean> => {
  try {
    // Verificar se já está autenticado
    if (auth.currentUser) {
      return true;
    }

    // Tentar autenticar com token customizado se disponível
    const initialToken = typeof window !== 'undefined' ? window.__initial_auth_token : null;
    
    if (initialToken) {
      await signInWithCustomToken(auth, initialToken);
    } else {
      // Fallback para autenticação anônima
      await signInAnonymously(auth);
    }
    
    return true;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return false;
  }
};

// Promise que resolve quando o usuário está autenticado
export const waitForAuth = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

// Função para obter o App ID
export const getFirebaseAppId = () => getAppId();

// Função para obter o user ID atual
export const getCurrentUserId = () => {
  return auth.currentUser?.uid || null;
};
