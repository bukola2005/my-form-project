const toggleBtn = document.querySelector('.mobile-nav__toggle');
const mobileMenu = document.querySelector('.mobile-nav__menu');

toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-active');
});

document.getElementById('x-button').addEventListener('click', () => {
    alert("X login is currently down for maintenance. Please use Google or Email.");
});
// 1. Import Firebase directly from the CDN
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// 2. PASTE YOUR REAL KEYS HERE
const firebaseConfig = {
  apiKey: "AIzaSyAsqrPK6ehh2yr7iT5HmqDuRkHXw_IF2uo",
  authDomain: "creative-network-auth.firebaseapp.com",
  projectId: "creative-network-auth",
  storageBucket: "creative-network-auth.firebasestorage.app",
  messagingSenderId: "309232919869",
  appId: "1:309232919869:web:7785ac0e98d58814ff5154",
  measurementId: "G-FT0GKR9TSQ"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ... the rest of your button logic goes down here

// 4. Select the Google Button from your HTML
const googleBtn = document.querySelector('.btn--google');

// 5. Add the Event Listener
googleBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Stops the button from refreshing the page
    
    try {
        // Trigger the Google popup
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log("Login Success! User details:", user);
        
        // Update the UI so you know it worked!
        googleBtn.innerHTML = `Welcome, ${user.displayName.split(' ')[0]}!`;
        googleBtn.style.backgroundColor = "#e8f5e9"; 
        googleBtn.style.color = "#2e7d32";
        googleBtn.style.border = "1px solid #2e7d32";
        
    } catch (error) {
        console.error("Google Auth failed:", error.message);
        alert("Failed to log in with Google. Check the console.");
    }
});

// --- EMAIL & PASSWORD SIGNUP LOGIC ---

// 1. Grab the form and its inputs from the HTML
const signupForm = document.querySelector('.form-signup');
const nameInput = document.getElementById('user-name');
const emailInput = document.getElementById('user-email');
const passwordInput = document.getElementById('user-password');
const submitBtn = document.querySelector('.btn--submit');

// 2. Listen for the form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stops the page from refreshing
    
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // Change button text to show it's loading
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Creating account...";

    try {
        // 3. Tell Firebase to create the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 4. Firebase only saves Email/Password by default. We have to manually add their Name.
        await updateProfile(user, { displayName: name });

        console.log("Account Created Successfully!", user);
        
        // Update UI to show success
        submitBtn.innerHTML = "Account Created!";
        submitBtn.style.backgroundColor = "#e8f5e9"; 
        submitBtn.style.color = "#2e7d32";
        submitBtn.style.border = "1px solid #2e7d32";
        
        // Optional: Clear the form
        signupForm.reset();

    } catch (error) {
        console.error("Signup failed:", error.message);
        
        // Show the error on the button so the user knows what went wrong 
        // (e.g., "Password too weak" or "Email already in use")
        submitBtn.innerHTML = "Error. Try Again.";
        alert(error.message); 
        
        // Reset button text after 3 seconds
        setTimeout(() => { submitBtn.innerHTML = originalBtnText; }, 3000);
    }
});

