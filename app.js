/* ==========================================
   EARNOVA APP ENGINE 6.0
   Telegram Auto Login
   Website Signup / Login
   Firebase Authentication
   Firestore User Profile
========================================== */

"use strict";

/* ==========================================
   1. CONFIGURATION
========================================== */

const firebaseConfig = {
    apiKey: "AIzaSyDTflVQ53gXH-D4WT0d03Iwr3lMBHQBU5cA",
    authDomain: "earnova-405c3.firebaseapp.com",
    projectId: "earnova-405c3",
    storageBucket: "earnova-405c3.firebasestorage.app",
    messagingSenderId: "726094697854",
    appId: "1:726094697854:web:3432981c0adc57a9560f2f",
    measurementId: "G-6PQS4HHX5XG"
};

const EARNOVA_AUTH_URL =
    "https://earnova-auth.monowerhossan487.workers.dev/auth";

const STORAGE_KEY = "earnova_player_data";

/* ==========================================
   2. GLOBAL VARIABLES
========================================== */

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDB = null;

let currentUser = null;
let playerData = null;

let isTelegramApp = false;
let isAppReady = false;

/* ==========================================
   3. TELEGRAM INITIALIZATION
========================================== */

function initializeTelegram() {

    if (!window.Telegram || !window.Telegram.WebApp) {
        isTelegramApp = false;
        return null;
    }

    const tg = window.Telegram.WebApp;

    try {
        tg.ready();
        tg.expand();
    } catch (error) {
        console.log("Telegram initialization:", error);
    }

    isTelegramApp = Boolean(tg.initData);

    return tg;
}

/* ==========================================
   4. FIREBASE SDK LOADER
========================================== */

function loadScript(url) {

    return new Promise((resolve, reject) => {

        const existing = document.querySelector(
            'script[src="' + url + '"]'
        );

        if (existing) {
            resolve();
            return;
        }

        const script = document.createElement("script");

        script.src = url;
        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);

    });

}

async function loadFirebaseSDK() {

    const version = "10.12.2";

    await loadScript(
        `https://www.gstatic.com/firebasejs/${version}/firebase-app-compat.js`
    );

    await loadScript(
        `https://www.gstatic.com/firebasejs/${version}/firebase-auth-compat.js`
    );

    await loadScript(
        `https://www.gstatic.com/firebasejs/${version}/firebase-firestore-compat.js`
    );

}

/* ==========================================
   5. FIREBASE INITIALIZATION
========================================== */

function initializeFirebase() {

    if (!window.firebase) {
        throw new Error("Firebase SDK could not load.");
    }

    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
        firebaseApp = firebase.app();
    }

    firebaseAuth = firebase.auth();
    firebaseDB = firebase.firestore();

}

/* ==========================================
   6. AUTHENTICATION SCREEN
========================================== */

function createAuthScreen() {

    if (document.getElementById("earnovaAuthScreen")) {
        return;
    }

    const overlay = document.createElement("div");

    overlay.id = "earnovaAuthScreen";

    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:999999;
        background:#07110d;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        overflow:auto;
    `;

    overlay.innerHTML = `

        <div style="
            width:100%;
            max-width:420px;
            background:#102019;
            border:1px solid #244533;
            border-radius:22px;
            padding:25px;
            color:white;
            box-sizing:border-box;
        ">

            <div style="
                text-align:center;
                margin-bottom:25px;
            ">

                <div style="
                    width:65px;
                    height:65px;
                    background:#163c28;
                    border-radius:18px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:32px;
                    margin:auto;
                ">
                    E
                </div>

                <h1 style="
                    margin:15px 0 5px;
                    color:#43e58c;
                ">
                    EARNOVA
                </h1>

                <p style="
                    color:#8fa797;
                    margin:0;
                ">
                    PLAY • TASK • EARN
                </p>

            </div>

            <div id="earnovaAuthContent"></div>

            <p id="earnovaAuthMessage" style="
                text-align:center;
                color:#9aafa2;
                font-size:13px;
                margin-top:18px;
            ">
                Connecting to EARNOVA...
            </p>

        </div>

    `;

    document.body.appendChild(overlay);

}

/* ==========================================
   7. AUTH SCREEN CONTENT
========================================== */

function showWebsiteAuth() {

    const content = document.getElementById(
        "earnovaAuthContent"
    );

    if (!content) return;

    content.innerHTML = `

        <div style="
            display:flex;
            gap:10px;
            margin-bottom:20px;
        ">

            <button id="earnovaLoginTab"
                style="
                    flex:1;
                    padding:13px;
                    border:0;
                    border-radius:12px;
                    background:#1b5535;
                    color:white;
                    font-weight:bold;
                ">
                Login
            </button>

            <button id="earnovaSignupTab"
                style="
                    flex:1;
                    padding:13px;
                    border:1px solid #244533;
                    border-radius:12px;
                    background:#102019;
                    color:white;
                    font-weight:bold;
                ">
                Sign Up
            </button>

        </div>

        <form id="earnovaAuthForm">

            <div id="earnovaNameField" style="
                display:none;
                margin-bottom:15px;
            ">

                <label style="
                    display:block;
                    margin-bottom:7px;
                    color:#c6d8cc;
                ">
                    Username
                </label>

                <input
                    id="earnovaUsername"
                    type="text"
                    placeholder="Enter username"
                    autocomplete="username"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:14px;
                        background:#07110d;
                        border:1px solid #244533;
                        border-radius:12px;
                        color:white;
                    "
                >

            </div>

            <div style="margin-bottom:15px;">

                <label style="
                    display:block;
                    margin-bottom:7px;
                    color:#c6d8cc;
                ">
                    Email
                </label>

                <input
                    id="earnovaEmail"
                    type="email"
                    placeholder="Enter email address"
                    autocomplete="email"
                    required
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:14px;
                        background:#07110d;
                        border:1px solid #244533;
                        border-radius:12px;
                        color:white;
                    "
                >

            </div>

            <div style="margin-bottom:20px;">

                <label style="
                    display:block;
                    margin-bottom:7px;
                    color:#c6d8cc;
                ">
                    Password
                </label>

                <input
                    id="earnovaPassword"
                    type="password"
                    placeholder="Enter password"
                    autocomplete="current-password"
                    required
                    minlength="6"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:14px;
                        background:#07110d;
                        border:1px solid #244533;
                        border-radius:12px;
                        color:white;
                    "
                >

            </div>

            <button id="earnovaAuthSubmit"
                type="submit"
                style="
                    width:100%;
                    padding:15px;
                    background:#16a34a;
                    border:0;
                    border-radius:12px;
                    color:white;
                    font-size:16px;
                    font-weight:bold;
                ">
                Login
            </button>

        </form>

    `;

    let authMode = "login";

    const loginTab = document.getElementById(
        "earnovaLoginTab"
    );

    const signupTab = document.getElementById(
        "earnovaSignupTab"
    );

    const nameField = document.getElementById(
        "earnovaNameField"
    );

    const submitButton = document.getElementById(
        "earnovaAuthSubmit"
    );

    const passwordInput = document.getElementById(
        "earnovaPassword"
    );

    function changeMode(mode) {

        authMode = mode;

        if (mode === "signup") {

            nameField.style.display = "block";

            loginTab.style.background = "#102019";
            loginTab.style.border = "1px solid #244533";

            signupTab.style.background = "#1b5535";
            signupTab.style.border = "0";

            submitButton.textContent = "Create Account";

            passwordInput.autocomplete = "new-password";

        } else {

            nameField.style.display = "none";

            loginTab.style.background = "#1b5535";
            loginTab.style.border = "0";

            signupTab.style.background = "#102019";
            signupTab.style.border = "1px solid #244533";

            submitButton.textContent = "Login";

            passwordInput.autocomplete = "current-password";

        }

    }

    loginTab.onclick = () => changeMode("login");

    signupTab.onclick = () => changeMode("signup");

    document.getElementById(
        "earnovaAuthForm"
    ).onsubmit = async function(event) {

        event.preventDefault();

        const email = document.getElementById(
            "earnovaEmail"
        ).value.trim();

        const password = passwordInput.value;

        const username = document.getElementById(
            "earnovaUsername"
        ).value.trim();

        submitButton.disabled = true;

        submitButton.textContent = "Please Wait...";

        setAuthStatus("Processing your account...");

        try {

            if (authMode === "signup") {

                if (!username) {
                    throw new Error("Please enter a username.");
                }

                const result =
                    await firebaseAuth.createUserWithEmailAndPassword(
                        email,
                        password
                    );

                await result.user.updateProfile({
                    displayName: username
                });

                currentUser = result.user;

                await saveUserProfile({
                    username: username,
                    email: email,
                    authType: "email"
                });

            } else {

                const result =
                    await firebaseAuth.signInWithEmailAndPassword(
                        email,
                        password
                    );

                currentUser = result.user;

            }

            await loadFirebaseUserProfile();

            startEarnova();

        } catch (error) {

            setAuthStatus(
                getFriendlyError(error),
                true
            );

            submitButton.disabled = false;

            submitButton.textContent =
                authMode === "signup"
                    ? "Create Account"
                    : "Login";

        }

    };

}

/* ==========================================
   8. AUTH STATUS
========================================== */

function setAuthStatus(message, isError = false) {

    const element = document.getElementById(
        "earnovaAuthMessage"
    );

    if (!element) return;

    element.textContent = message;

    element.style.color = isError
        ? "#ff7777"
        : "#9aafa2";

}

/* ==========================================
   9. FRIENDLY FIREBASE ERRORS
========================================== */

function getFriendlyError(error) {

    const code = error.code || "";

    const errors = {

        "auth/email-already-in-use":
            "This email is already registered.",

        "auth/invalid-email":
            "Please enter a valid email address.",

        "auth/weak-password":
            "Password must be at least 6 characters.",

        "auth/user-not-found":
            "Account not found. Please Sign Up.",

        "auth/wrong-password":
            "Incorrect password.",

        "auth/invalid-credential":
            "Email or password is incorrect.",

        "auth/too-many-requests":
            "Too many attempts. Please try again later.",

        "auth/network-request-failed":
            "Internet connection problem.",

        "auth/operation-not-allowed":
            "Email/Password Authentication is not enabled in Firebase."

    };

    return errors[code] || error.message || "Authentication failed.";

}

/* ==========================================
   10. TELEGRAM AUTHENTICATION
========================================== */

async function authenticateWithTelegram() {

    const tg = initializeTelegram();

    if (!tg || !tg.initData) {
        return false;
    }

    setAuthStatus("Verifying Telegram account...");

    const response = await fetch(
        EARNOVA_AUTH_URL,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                initData: tg.initData
            })
        }
    );

    if (!response.ok) {

        throw new Error(
            "Telegram authentication failed. HTTP " +
            response.status
        );

    }

    const result = await response.json();

    if (!result.token) {
        throw new Error("Firebase token was not received.");
    }

    const authResult =
        await firebaseAuth.signInWithCustomToken(
            result.token
        );

    currentUser = authResult.user;

    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {

        const telegramUser =
            tg.initDataUnsafe.user;

        await saveUserProfile({

            username:
                telegramUser.username ||
                telegramUser.first_name ||
                "Telegram User",

            telegramId:
                String(telegramUser.id),

            authType: "telegram"

        });

    }

    await loadFirebaseUserProfile();

    return true;

}

/* ==========================================
   11. FIRESTORE PROFILE
========================================== */

async function saveUserProfile(extraData = {}) {

    if (!currentUser || !firebaseDB) {
        return;
    }

    const userRef = firebaseDB
        .collection("users")
        .doc(currentUser.uid);

    const snapshot = await userRef.get();

    const data = {

        uid: currentUser.uid,

        username:
            extraData.username ||
            currentUser.displayName ||
            "Player",

        email:
            extraData.email ||
            currentUser.email ||
            "",

        updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

    };

    if (extraData.telegramId) {
        data.telegramId = extraData.telegramId;
    }

    if (extraData.authType) {
        data.authType = extraData.authType;
    }

    if (!snapshot.exists) {

        data.createdAt =
            firebase.firestore.FieldValue.serverTimestamp();

        data.balance = 0;
        data.xp = 0;
        data.gamesPlayed = 0;
        data.tasksCompleted = 0;

    }

    await userRef.set(
        data,
        { merge: true }
    );

}

/* ==========================================
   12. LOAD USER PROFILE
========================================== */

async function loadFirebaseUserProfile() {

    if (!currentUser) {
        throw new Error("User authentication missing.");
    }

    const userRef = firebaseDB
        .collection("users")
        .doc(currentUser.uid);

    const snapshot = await userRef.get();

    let profile = {};

    if (snapshot.exists) {
        profile = snapshot.data();
    }

    const username =
        profile.username ||
        currentUser.displayName ||
        currentUser.email ||
        "Player";

    playerData = {

        uid: currentUser.uid,

        userId: currentUser.uid,

        username: username,

        email: currentUser.email || "",

        balance: Number(profile.balance || 0),

        xp: Number(profile.xp || 0),

        gamesPlayed:
            Number(profile.gamesPlayed || 0),

        tasksCompleted:
            Number(profile.tasksCompleted || 0),

        streak:
            Number(profile.streak || 0)

    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(playerData)
    );

}

/* ==========================================
   13. HIDE AUTH SCREEN
========================================== */

function hideAuthScreen() {

    const overlay = document.getElementById(
        "earnovaAuthScreen"
    );

    if (overlay) {
        overlay.remove();
    }

}

/* ==========================================
   14. START APP
========================================== */

function startEarnova() {

    if (isAppReady) return;

    isAppReady = true;

    hideAuthScreen();

    updateDashboard();

    initializeNavigation();

    initializeWallet();

    initializeReferral();

    initializeProfile();

    initializeModules();

    console.log(
        "EARNOVA Ready:",
        currentUser.uid
    );

}

/* ==========================================
   15. DASHBOARD
========================================== */

function updateDashboard() {

    if (!playerData) return;

    const username = document.getElementById(
        "username"
    );

    const balance = document.getElementById(
        "balance"
    );

    const walletBalance = document.getElementById(
        "walletBalance"
    );

    const xpDisplay = document.getElementById(
        "xpDisplay"
    );

    const gamesPlayed = document.getElementById(
        "gamesPlayed"
    );

    const tasksCompleted = document.getElementById(
        "tasksCompleted"
    );

    const streak = document.getElementById(
        "streak"
    );

    const profileName = document.getElementById(
        "profileName"
    );

    const profileId = document.getElementById(
        "profileId"
    );

    if (username) {
        username.textContent = playerData.username;
    }

    if (balance) {
        balance.textContent =
            "৳" + Number(playerData.balance).toFixed(2);
    }

    if (walletBalance) {
        walletBalance.textContent =
            "৳" + Number(playerData.balance).toFixed(2);
    }

    if (xpDisplay) {
        xpDisplay.textContent =
            Number(playerData.xp) + " XP";
    }

    if (gamesPlayed) {
        gamesPlayed.textContent =
            playerData.gamesPlayed;
    }

    if (tasksCompleted) {
        tasksCompleted.textContent =
            playerData.tasksCompleted;
    }

    if (streak) {
        streak.textContent =
            playerData.streak + " Days";
    }

    if (profileName) {
        profileName.textContent =
            playerData.username;
    }

    if (profileId) {
        profileId.textContent =
            "User ID: " + playerData.uid;
    }

}

/* ==========================================
   16. NAVIGATION
========================================== */

function initializeNavigation() {

    document.addEventListener(
        "click",
        function(event) {

            const button = event.target.closest(
                "[data-page]"
            );

            if (!button) return;

            const page = button.dataset.page;

            if (!page) return;

            showPage(page);

        }
    );

}

function showPage(page) {

    document.querySelectorAll(
        ".section"
    ).forEach(section => {

        section.classList.remove("active");

    });

    document.querySelectorAll(
        ".nav-item"
    ).forEach(button => {

        button.classList.remove("active");

    });

    const targetSection = document.getElementById(
        page + "Section"
    );

    if (targetSection) {
        targetSection.classList.add("active");
    }

    document.querySelectorAll(
        '[data-page="' + page + '"]'
    ).forEach(button => {

        button.classList.add("active");

    });

    const mainContent = document.getElementById(
        "mainContent"
    );

    if (mainContent) {
        mainContent.scrollTop = 0;
    }

}

/* ==========================================
   17. WALLET
========================================== */

function initializeWallet() {

    const withdrawBtn = document.getElementById(
        "withdrawBtn"
    );

    const historyBtn = document.getElementById(
        "historyBtn"
    );

    const closeWithdrawBtn =
        document.getElementById("closeWithdrawBtn");

    const closeHistoryBtn =
        document.getElementById("closeHistoryBtn");

    const withdrawPanel =
        document.getElementById("withdrawPanel");

    const historyPanel =
        document.getElementById("historyPanel");

    if (withdrawBtn) {

        withdrawBtn.onclick = function() {

            if (withdrawPanel) {
                withdrawPanel.style.display = "block";
            }

            if (historyPanel) {
                historyPanel.style.display = "none";
            }

        };

    }

    if (historyBtn) {

        historyBtn.onclick = function() {

            if (historyPanel) {
                historyPanel.style.display = "block";
            }

            if (withdrawPanel) {
                withdrawPanel.style.display = "none";
            }

            renderTransactions();

        };

    }

    if (closeWithdrawBtn) {

        closeWithdrawBtn.onclick = function() {

            withdrawPanel.style.display = "none";

        };

    }

    if (closeHistoryBtn) {

        closeHistoryBtn.onclick = function() {

            historyPanel.style.display = "none";

        };

    }

    initializeWithdrawMethods();

    const submitWithdrawBtn =
        document.getElementById("submitWithdrawBtn");

    if (submitWithdrawBtn) {

        submitWithdrawBtn.onclick =
            submitWithdrawal;

    }

}

function initializeWithdrawMethods() {

    const methods = document.querySelectorAll(
        ".withdraw-method"
    );

    methods.forEach(button => {

        button.onclick = function() {

            methods.forEach(item => {

                item.classList.remove("active");

                item.style.background = "#10251b";

            });

            button.classList.add("active");

            button.style.background = "#163b29";

            const selectedMethod =
                document.getElementById(
                    "selectedWithdrawMethod"
                );

            if (selectedMethod) {
                selectedMethod.value =
                    button.dataset.method;
            }

        };

    });

}

function submitWithdrawal() {

    alert(
        "Withdrawal System\n\n" +
        "Real withdrawals will be connected " +
        "after the backend is completed."
    );

}

/* ==========================================
   18. TRANSACTIONS
========================================== */

function getTransactions() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "earnova_transactions"
            )
        ) || [];

    } catch {

        return [];

    }

}

function renderTransactions() {

    const container = document.getElementById(
        "transactionList"
    );

    if (!container) return;

    const transactions = getTransactions();

    if (!transactions.length) {

        container.innerHTML = `
            <div style="
                text-align:center;
                padding:20px;
                color:#8fa797;
            ">
                No transactions yet.
            </div>
        `;

        return;

    }

    container.innerHTML =
        transactions.map(transaction => `

            <div style="
                background:#07110d;
                border:1px solid #244533;
                padding:14px;
                border-radius:12px;
                margin-bottom:10px;
            ">

                <strong style="color:white;">
                    ${transaction.type || "Transaction"}
                </strong>

                <div style="
                    color:#43e58c;
                    margin-top:5px;
                ">
                    ৳${Number(
                        transaction.amount || 0
                    ).toFixed(2)}
                </div>

            </div>

        `).join("");

}

/* ==========================================
   19. REFERRAL
========================================== */

function initializeReferral() {

    const referralLink = document.getElementById(
        "referralLink"
    );

    if (!referralLink || !playerData) return;

    referralLink.textContent =
        "https://t.me/EarnOva24_bot?start=" +
        playerData.uid;

    const copyButton = document.getElementById(
        "copyReferralBtn"
    );

    if (copyButton) {

        copyButton.onclick = async function() {

            const text = referralLink.textContent;

            try {

                await navigator.clipboard.writeText(text);

                alert("Referral link copied!");

            } catch {

                alert(text);

            }

        };

    }

}

/* ==========================================
   20. PROFILE
========================================== */

function initializeProfile() {

    const profileMenu = document.querySelector(
        ".profile-menu"
    );

    if (!profileMenu) return;

    if (document.getElementById(
        "earnovaLogoutButton"
    )) {
        return;
    }

    const logoutButton = document.createElement(
        "button"
    );

    logoutButton.id = "earnovaLogoutButton";

    logoutButton.className = "profile-menu-item";

    logoutButton.textContent = "🚪 Logout";

    logoutButton.onclick = async function() {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        await firebaseAuth.signOut();

        location.reload();

    };

    profileMenu.appendChild(logoutButton);

}

/* ==========================================
   21. APP MODULES
========================================== */

function initializeModules() {

    try {

        if (
            window.EARNOVA_TASKS &&
            typeof window.EARNOVA_TASKS.render === "function"
        ) {

            window.EARNOVA_TASKS.render();

        }

    } catch(error) {

        console.log("Tasks module:", error);

    }

    try {

        if (
            window.EARNOVA_SIGNUP &&
            typeof window.EARNOVA_SIGNUP.render === "function"
        ) {

            window.EARNOVA_SIGNUP.render();

        }

    } catch(error) {

        console.log("Signup module:", error);

    }

}

/* ==========================================
   22. GLOBAL API
========================================== */

window.EARNOVA = {

    get player() {
        return playerData;
    },

    get user() {
        return currentUser;
    },

    get auth() {
        return firebaseAuth;
    },

    get database() {
        return firebaseDB;
    },

    updateDashboard: updateDashboard,

    showPage: showPage,

    logout: async function() {

        if (firebaseAuth) {
            await firebaseAuth.signOut();
        }

        location.reload();

    }

};

/* ==========================================
   23. MAIN STARTUP
========================================== */

async function startFirebaseSystem() {

    createAuthScreen();

    setAuthStatus("Loading EARNOVA...");

    try {

        await loadFirebaseSDK();

        initializeFirebase();

        const tg = initializeTelegram();

        /* TELEGRAM LOGIN */

        if (tg && tg.initData) {

            setAuthStatus(
                "Telegram account detected..."
            );

            await authenticateWithTelegram();

            startEarnova();

            return;

        }

        /* WEBSITE LOGIN */

        const existingUser =
            firebaseAuth.currentUser;

        if (existingUser) {

            currentUser = existingUser;

            await loadFirebaseUserProfile();

            startEarnova();

            return;

        }

        /* WEBSITE SIGNUP / LOGIN */

        setAuthStatus(
            "Create an account or Login."
        );

        showWebsiteAuth();

    } catch(error) {

        console.error(
            "EARNOVA Authentication Error:",
            error
        );

        setAuthStatus(
            getFriendlyError(error),
            true
        );

        const content = document.getElementById(
            "earnovaAuthContent"
        );

        if (content) {

            content.innerHTML = `

                <button onclick="location.reload()"
                    style="
                        width:100%;
                        padding:15px;
                        background:#16a34a;
                        border:0;
                        border-radius:12px;
                        color:white;
                        font-weight:bold;
                    ">
                    🔄 Retry
                </button>

            `;

        }

    }

}

/* ==========================================
   24. INITIALIZE
========================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startFirebaseSystem
    );

} else {

    startFirebaseSystem();

}