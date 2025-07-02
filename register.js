// Configuración de Firebase (mismo que en login.js)
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

// Función para manejar el registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validaciones
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    if (!terms) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }

    try {
        // Crear usuario en Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Actualizar perfil del usuario con el nombre completo
        await userCredential.user.updateProfile({
            displayName: username
        });

        // Aquí podrías guardar información adicional en Firestore si lo deseas
        // Por ahora, solo redirigimos al usuario
        window.location.href = 'login.html';
    } catch (error) {
        alert('Error al registrarse: ' + error.message);
    }
});
