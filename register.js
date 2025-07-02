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

// Verificar si Firebase está disponible
if (typeof firebase === 'undefined') {
    console.error('Firebase no está disponible');
    alert('Error: Firebase no está disponible. Por favor, intenta recargar la página.');
    throw new Error('Firebase no está disponible');
}

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Verificar si la autenticación está disponible
if (!firebase.auth) {
    console.error('Firebase Auth no está disponible');
    alert('Error: Firebase Auth no está disponible. Por favor, intenta recargar la página.');
    throw new Error('Firebase Auth no está disponible');
}

// Asegurarse de que la inicialización esté completa
firebase.auth().onAuthStateChanged((user) => {
    console.log('Firebase Auth inicializado');
});

// Función para manejar el registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        // Validar campos
        const username = document.getElementById('username').value.trim();
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const gender = document.getElementById('gender').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        if (!username || !fullName || !email || !gender || !password || !confirmPassword) {
            throw new Error('Todos los campos son requeridos');
        }

        if (password !== confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
        }

        if (!terms) {
            throw new Error('Debes aceptar los términos y condiciones');
        }

        if (!email.includes('@')) {
            throw new Error('Formato de correo electrónico inválido');
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Deshabilitar el botón durante el proceso
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Registrando...';

        // Crear usuario
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Actualizar perfil
        await userCredential.user.updateProfile({
            displayName: username,
            photoURL: "https://ui-avatars.com/api/?name=" + username
        });

        // Redirigir
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = error.message;
        
        // Manejar errores específicos de Firebase
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este correo ya está registrado';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        } else if (error.code === 'auth/configuration-not-found') {
            errorMessage = 'Error de configuración de Firebase. Por favor, intenta recargar la página.';
        }

        alert(errorMessage);
        
        // Rehabilitar el botón
        const submitButton = e.target.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Registrarme';
        }
    }
});