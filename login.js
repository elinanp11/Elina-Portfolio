// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBoBaMvAenO3PMR5EUfaWUIsFi_AYqAjwQ",
    authDomain: "my-proyects-b614c.firebaseapp.com",
    projectId: "my-proyects-b614c",
    storageBucket: "my-proyects-b614c.firebasestorage.app",
    messagingSenderId: "646388078931",
    appId: "1:646388078931:web:5aca4f1566effa92fee9a6",
    measurementId: "G-ZBWJ2TQ588"
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Función para manejar el inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    try {
        // Iniciar sesión
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        
        // Si recordar sesión está marcado, establecer cookie
        if (remember) {
            document.cookie = `userEmail=${email}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
        }
        
        // Redirigir al usuario a la página principal
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión: ' + error.message);
    }
});
