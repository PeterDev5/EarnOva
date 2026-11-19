/* ==========================================
   EARNOVA APP ENGINE 4.0
   Firebase Authentication
   Dashboard • Wallet • XP
   Withdrawal • Transactions • Referral
========================================== */

"use strict";

/* ==========================================
   1. FIREBASE CONFIGURATION
========================================== */

const firebaseConfig = {
    apiKey: "AIzaSyDTflVQ53gXH-D4WT0d03Iwr3lMBHQBU5cA",
    authDomain: "earnova-405c3.firebaseapp.com",
    projectId: "earnova-405c3",
    storageBucket: "earnova-405c3.firebasestorage.app",
    messagingSenderId: "726094697854",
    appId: "1:726094697854:web:3432981c0adc57a9560f2f",
    measurementId: "G-6PQS4HHX5G"
};

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDB = null;
let currentFirebaseUser = null;

function loadFirebaseSDK() {
    return new Promise((resolve, reject) => {

        if (window.firebase && window.firebase.auth) {
            resolve();
            return;
        }

        const scripts = [
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js",
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"
        ];

        let index = 0;

        function loadNext() {
            if (index >= scripts.length) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = scripts[index];
            script.onload = () => {
                index++;
                loadNext();
            };

            script.onerror = () => {
                reject(new Error("Firebase SDK Load Failed"));
            };

            document.head.appendChild(script);
        }

        loadNext();
    });
}

async function initializeFirebase() {
    try {

        await loadFirebaseSDK();

        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        firebaseDB = firebase.firestore();

        console.log("Firebase Connected");

        return true;

    } catch (error) {

        console.error("Firebase Error:", error);

        return false;
    }
}

/* ==========================================
   2. AUTHENTICATION UI
========================================== */

function createAuthUI() {

    if (document.getElementById("earnovaAuthScreen")) {
        return;
    }

    const authScreen = document.createElement("div");

    authScreen.id = "earnovaAuthScreen";

    authScreen.innerHTML = `
        <div class="earnova-auth-card">

            <div class="earnova-auth-logo">
                <div class="earnova-auth-icon">E</div>
                <h1>EARNOVA</h1>
                <p>Earn • Play • Grow</p>
            </div>

            <div class="earnova-auth-tabs">
                <button id="authLoginTab" class="active">
                    Login
                </button>

                <button id="authSignupTab">
                    Sign Up
                </button>
            </div>

            <form id="earnovaAuthForm">

                <div id="authNameField" style="display:none">
                    <label>Full Name</label>

                    <input
                        type="text"
                        id="authName"
                        placeholder="Enter your name"
                    >
                </div>

                <label>Email Address</label>

                <input
                    type="email"
                    id="authEmail"
                    placeholder="Enter your email"
                    required
                >

                <label>Password</label>

                <input
                    type="password"
                    id="authPassword"
                    placeholder="Enter password"
                    minlength="6"
                    required
                >

                <button
                    type="submit"
                    id="authSubmitBtn"
                    class="earnova-auth-submit"
                >
                    Login
                </button>

            </form>

            <button
                id="authForgotPassword"
                class="earnova-forgot"
            >
                Forgot Password?
            </button>

            <div id="authMessage"></div>

            <div class="earnova-auth-footer">
                Secure account powered by Firebase
            </div>

        </div>
    `;

    document.body.appendChild(authScreen);

    const style = document.createElement("style");

    style.textContent = `
        #earnovaAuthScreen {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: #06100b;
            overflow-y: auto;
        }

        .earnova-auth-card {
            width: 100%;
            max-width: 420px;
            padding: 28px;
            border-radius: 22px;
            background: #0d1b13;
            border: 1px solid #1d4430;
            box-shadow: 0 20px 60px rgba(0,0,0,.5);
            color: white;
            font-family: Arial, sans-serif;
        }

        .earnova-auth-logo {
            text-align: center;
            margin-bottom: 25px;
        }

        .earnova-auth-icon {
            width: 60px;
            height: 60px;
            margin: auto;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #16a34a;
            color: white;
            font-size: 32px;
            font-weight: bold;
        }

        .earnova-auth-logo h1 {
            margin: 15px 0 5px;
            color: #4ade80;
            letter-spacing: 3px;
        }

        .earnova-auth-logo p {
            color: #8da99a;
            font-size: 13px;
        }

        .earnova-auth-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .earnova-auth-tabs button {
            flex: 1;
            padding: 12px;
            border: 1px solid #254735;
            background: #14251b;
            color: white;
            border-radius: 10px;
            cursor: pointer;
        }

        .earnova-auth-tabs button.active {
            background: #16a34a;
            border-color: #16a34a;
        }

        .earnova-auth-card label {
            display: block;
            margin: 14px 0 7px;
            color: #b6c8bc;
            font-size: 13px;
        }

        .earnova-auth-card input {
            box-sizing: border-box;
            width: 100%;
            padding: 14px;
            border: 1px solid #294536;
            background: #07130c;
            color: white;
            border-radius: 10px;
            outline: none;
        }

        .earnova-auth-card input:focus {
            border-color: #4ade80;
        }

        .earnova-auth-submit {
            width: 100%;
            margin-top: 20px;
            padding: 14px;
            border: none;
            border-radius: 10px;
            background: #16a34a;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        .earnova-auth-submit:disabled {
            opacity: .6;
        }

        .earnova-forgot {
            width: 100%;
            margin-top: 15px;
            background: transparent;
            color: #4ade80;
            border: none;
            cursor: pointer;
        }

        #authMessage {
            margin-top: 15px;
            font-size: 13px;
            text-align: center;
            overflow-wrap: anywhere;
        }

        .earnova-auth-footer {
            margin-top: 20px;
            text-align: center;
            color: #718679;
            font-size: 11px;
        }
    `;

    document.head.appendChild(style);

    setupAuthEvents();
}

let authMode = "login";

function setAuthMode(mode) {

    authMode = mode;

    const loginTab = document.getElementById("authLoginTab");
    const signupTab = document.getElementById("authSignupTab");

    const nameField = document.getElementById("authNameField");
    const submitButton = document.getElementById("authSubmitBtn");

    if (mode === "signup") {

        signupTab.classList.add("active");
        loginTab.classList.remove("active");

        nameField.style.display = "block";

        submitButton.textContent = "Create Account";

    } else {

        loginTab.classList.add("active");
        signupTab.classList.remove("active");

        nameField.style.display = "none";

        submitButton.textContent = "Login";
    }

    document.getElementById("authMessage").textContent = "";
}

function authMessage(message, color = "#4ade80") {

    const element = document.getElementById("authMessage");

    if (!element) return;

    element.textContent = message;
    element.style.color = color;
}

function setupAuthEvents() {

    document.getElementById("authLoginTab")
        .addEventListener("click", () => setAuthMode("login"));

    document.getElementById("authSignupTab")
        .addEventListener("click", () => setAuthMode("signup"));

    document.getElementById("earnovaAuthForm")
        .addEventListener("submit", async function(event) {

            event.preventDefault();

            if (!firebaseAuth) {
                authMessage("Firebase is not connected.", "#ff7070");
                return;
            }

            const name = document.getElementById("authName")
                .value.trim();

            const email = document.getElementById("authEmail")
                .value.trim();

            const password = document.getElementById("authPassword")
                .value;

            const submitButton =
                document.getElementById("authSubmitBtn");

            submitButton.disabled = true;

            authMessage("Please wait...", "#facc15");

            try {

                if (authMode === "signup") {

                    if (name.length < 2) {
                        throw new Error("Please enter your full name.");
                    }

                    const result =
                        await firebaseAuth.createUserWithEmailAndPassword(
                            email,
                            password
                        );

                    await result.user.updateProfile({
                        displayName: name
                    });

                    await createFirebaseUserProfile(result.user, name);

                    authMessage("Account created successfully!");

                } else {

                    await firebaseAuth.signInWithEmailAndPassword(
                        email,
                        password
                    );

                    authMessage("Login successful!");
                }

            } catch (error) {

                console.error("Authentication Error:", error);

                authMessage(
                    getAuthErrorMessage(error),
                    "#ff7070"
                );

            } finally {

                submitButton.disabled = false;
            }

        });

    document.getElementById("authForgotPassword")
        .addEventListener("click", async function() {

            const email = document.getElementById("authEmail").value.trim();

            if (!email) {
                authMessage("Enter your email address first.", "#ff7070");
                return;
            }

            try {

                await firebaseAuth.sendPasswordResetEmail(email);

                authMessage("Password reset email sent!");

            } catch (error) {

                authMessage(
                    getAuthErrorMessage(error),
                    "#ff7070"
                );
            }
        });
}

function getAuthErrorMessage(error) {

    const messages = {
        "auth/email-already-in-use":
            "This email already has an account.",

        "auth/invalid-email":
            "Please enter a valid email.",

        "auth/weak-password":
            "Password must contain at least 6 characters.",

        "auth/user-not-found":
            "Account not found.",

        "auth/wrong-password":
            "Incorrect password.",

        "auth/invalid-credential":
            "Incorrect email or password.",

        "auth/too-many-requests":
            "Too many attempts. Try again later.",

        "auth/network-request-failed":
            "Internet connection problem.",

        "auth/operation-not-allowed":
            "Email/Password authentication is not enabled."
    };

    return messages[error.code] || error.message;
}

/* ==========================================
   3. FIREBASE USER PROFILE
========================================== */

async function createFirebaseUserProfile(user, name) {

    if (!firebaseDB || !user) return;

    const profile = {
        uid: user.uid,
        name: name || user.displayName || "Player",
        email: user.email || "",
        createdAt: new Date().toISOString()
    };

    try {

        await firebaseDB
            .collection("users")
            .doc(user.uid)
            .set(profile);

        console.log("Firebase Profile Created");

    } catch (error) {

        console.warn(
            "Profile not saved. Firestore Rules may need updating:",
            error
        );
    }
}

async function loadFirebaseUserProfile(user) {

    if (!firebaseDB || !user) return;

    try {

        const doc = await firebaseDB
            .collection("users")
            .doc(user.uid)
            .get();

        if (doc.exists) {

            const profile = doc.data();

            if (profile.name) {
                playerData.username = profile.name;
            }

        } else {

            await createFirebaseUserProfile(
                user,
                user.displayName || "Player"
            );

            playerData.username =
                user.displayName || "Player";
        }

        playerData.userId = user.uid;

        savePlayerData();
        updateDashboard();

    } catch (error) {

        console.warn("Profile loading error:", error);
    }
}

/* ==========================================
   4. AUTH STATE
========================================== */

function setupFirebaseAuthState() {

    firebaseAuth.onAuthStateChanged(async function(user) {

        currentFirebaseUser = user;

        const authScreen =
            document.getElementById("earnovaAuthScreen");

        if (user) {

            if (authScreen) {
                authScreen.style.display = "none";
            }

            await loadFirebaseUserProfile(user);

            console.log(
                "Authenticated User:",
                user.uid
            );

        } else {

            if (authScreen) {
                authScreen.style.display = "flex";
            }

            console.log("No authenticated user");
        }

    });
}

async function logoutEarnova() {

    if (!firebaseAuth) return;

    try {

        await firebaseAuth.signOut();

        showNotification("Logged out successfully.");

    } catch (error) {

        showNotification("Logout failed.");
    }
}

/* ==========================================
   5. STORAGE SYSTEM
========================================== */

const EARNOVA_STORAGE_KEY = "earnova_player_data";
const EARNOVA_TRANSACTION_KEY = "earnova_transactions";

const defaultPlayerData = {
    username: "Player",
    balance: 0,
    totalEarnings: 0,
    xp: 0,
    gamesPlayed: 0,
    tasksCompleted: 0,
    todayEarnings: 0,
    streak: 0,
    lastCheckin: "",
    referralCount: 0,
    referralEarnings: 0,
    userId: "EV-" + Math.floor(100000 + Math.random() * 900000),
    notifications: []
};

function loadPlayerData() {

    try {

        const saved = localStorage.getItem(EARNOVA_STORAGE_KEY);

        if (saved) {

            return {
                ...defaultPlayerData,
                ...JSON.parse(saved)
            };
        }

        return { ...defaultPlayerData };

    } catch (error) {

        console.error("Storage Error:", error);

        return { ...defaultPlayerData };
    }
}

let playerData = loadPlayerData();

function savePlayerData() {

    try {

        localStorage.setItem(
            EARNOVA_STORAGE_KEY,
            JSON.stringify(playerData)
        );

    } catch (error) {

        console.error("Save Error:", error);
    }
}

/* ==========================================
   6. TRANSACTION STORAGE
========================================== */

function loadTransactions() {

    try {

        const saved = localStorage.getItem(EARNOVA_TRANSACTION_KEY);

        return saved ? JSON.parse(saved) : [];

    } catch (error) {

        return [];
    }
}

let transactions = loadTransactions();

function saveTransactions() {

    try {

        localStorage.setItem(
            EARNOVA_TRANSACTION_KEY,
            JSON.stringify(transactions)
        );

    } catch (error) {

        console.error("Transaction Save Error:", error);
    }
}

function createTransaction(
    type,
    amount,
    details,
    status = "Completed"
) {

    const transaction = {
        id: "TX-" + Date.now(),
        type,
        amount: Number(amount),
        details,
        status,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    };

    transactions.unshift(transaction);

    if (transactions.length > 500) {
        transactions = transactions.slice(0, 500);
    }

    saveTransactions();

    return transaction;
}

/* ==========================================
   7. UTILITY FUNCTIONS
========================================== */

function formatMoney(amount) {
    return "৳" + Number(amount || 0).toFixed(2);
}

function getTodayDate() {

    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
}

function showNotification(message) {
    alert(message);
}

function addXP(amount) {

    amount = Number(amount) || 0;

    playerData.xp += amount;

    savePlayerData();
    updateDashboard();
}

/* ==========================================
   8. DEMO EARNINGS
========================================== */

function addDemoBalance(amount, source = "Reward") {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return false;
    }

    playerData.balance += amount;
    playerData.totalEarnings += amount;
    playerData.todayEarnings += amount;

    createTransaction(
        "Earning",
        amount,
        source,
        "Completed"
    );

    savePlayerData();
    updateDashboard();

    return true;
}

/* ==========================================
   9. DASHBOARD
========================================== */

function updateDashboard() {

    const elements = {
        balance: document.getElementById("balance"),
        walletBalance: document.getElementById("walletBalance"),
        xp: document.getElementById("xpDisplay"),
        games: document.getElementById("gamesPlayed"),
        tasks: document.getElementById("tasksCompleted"),
        earnings: document.getElementById("todayEarnings"),
        streak: document.getElementById("streak"),
        referralCount: document.getElementById("referralCount"),
        referralEarnings: document.getElementById("referralEarnings"),
        username: document.getElementById("username"),
        profileName: document.getElementById("profileName"),
        profileId: document.getElementById("profileId"),
        totalEarnings: document.getElementById("totalEarnings")
    };

    if (elements.balance) {
        elements.balance.textContent =
            formatMoney(playerData.balance);
    }

    if (elements.walletBalance) {
        elements.walletBalance.textContent =
            formatMoney(playerData.balance);
    }

    if (elements.xp) {
        elements.xp.textContent = playerData.xp + " XP";
    }

    if (elements.games) {
        elements.games.textContent = playerData.gamesPlayed;
    }

    if (elements.tasks) {
        elements.tasks.textContent = playerData.tasksCompleted;
    }

    if (elements.earnings) {
        elements.earnings.textContent =
            formatMoney(playerData.todayEarnings);
    }

    if (elements.streak) {
        elements.streak.textContent =
            playerData.streak + " Days";
    }

    if (elements.referralCount) {
        elements.referralCount.textContent =
            playerData.referralCount;
    }

    if (elements.referralEarnings) {
        elements.referralEarnings.textContent =
            formatMoney(playerData.referralEarnings);
    }

    if (elements.totalEarnings) {
        elements.totalEarnings.textContent =
            formatMoney(playerData.totalEarnings);
    }

    if (elements.username) {
        elements.username.textContent =
            playerData.username;
    }

    if (elements.profileName) {
        elements.profileName.textContent =
            playerData.username;
    }

    if (elements.profileId) {
        elements.profileId.textContent =
            "User ID: " + playerData.userId;
    }

    updateWithdrawBalance();
}

/* ==========================================
   10. NAVIGATION
========================================== */

const pageMap = {
    home: "homeSection",
    tasks: "tasksSection",
    surveys: "surveysSection",
    signup: "signupSection",
    games: "gamesSection",
    offers: "offersSection",
    wallet: "walletSection",
    referral: "referralSection",
    profile: "profileSection"
};

function showPage(pageName) {

    const sectionId = pageMap[pageName];

    if (!sectionId) {
        console.warn("Page not found:", pageName);
        return;
    }

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const targetSection =
        document.getElementById(sectionId);

    if (targetSection) {
        targetSection.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.remove("active");
    });

    const activeNav = document.querySelector(
        `.nav-item[data-page="${pageName}"]`
    );

    if (activeNav) {
        activeNav.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", function() {

        showPage(this.dataset.page);

    });

});

/* ==========================================
   11. REFERRAL
========================================== */

const copyReferralBtn =
    document.getElementById("copyReferralBtn");

const referralLinkElement =
    document.getElementById("referralLink");

function getReferralLink() {
    return "EARNOVA Referral ID: " + playerData.userId;
}

if (referralLinkElement) {
    referralLinkElement.textContent = getReferralLink();
}

if (copyReferralBtn) {

    copyReferralBtn.addEventListener("click", async function() {

        const link = getReferralLink();

        try {

            await navigator.clipboard.writeText(link);

            showNotification("📋 Referral ID copied!");

        } catch (error) {

            showNotification(link);
        }

    });
}

/* ==========================================
   12. NOTIFICATIONS
========================================== */

const notificationBtn =
    document.getElementById("notificationBtn");

if (notificationBtn) {

    notificationBtn.addEventListener("click", function() {

        showNotification(
            "🔔 EARNOVA Notifications\n\n" +
            "You are all caught up!"
        );

    });
}

/* ==========================================
   13. WALLET
========================================== */

function getWalletSummary() {

    return {
        balance: playerData.balance,
        totalEarnings: playerData.totalEarnings,
        todayEarnings: playerData.todayEarnings,

        totalWithdrawals: transactions
            .filter(tx => tx.type === "Withdrawal")
            .reduce((sum, tx) => sum + tx.amount, 0),

        transactionCount: transactions.length
    };
}

function updateWithdrawBalance() {

    const balanceElement =
        document.getElementById("walletBalance");

    if (balanceElement) {
        balanceElement.textContent =
            formatMoney(playerData.balance);
    }

    const amountInput =
        document.getElementById("withdrawAmount");

    if (amountInput) {
        amountInput.max = playerData.balance;
    }
}

/* ==========================================
   14. WITHDRAWAL INTERFACE
========================================== */

const withdrawBtn =
    document.getElementById("withdrawBtn");

const withdrawPanel =
    document.getElementById("withdrawPanel");

const historyPanel =
    document.getElementById("historyPanel");

const closeWithdrawBtn =
    document.getElementById("closeWithdrawBtn");

const closeHistoryBtn =
    document.getElementById("closeHistoryBtn");

const withdrawAmountInput =
    document.getElementById("withdrawAmount");

const withdrawAccountInput =
    document.getElementById("withdrawAccount");

const selectedWithdrawMethodInput =
    document.getElementById("selectedWithdrawMethod");

const submitWithdrawBtn =
    document.getElementById("submitWithdrawBtn");

function closeWalletPanels() {

    if (withdrawPanel) {
        withdrawPanel.style.display = "none";
    }

    if (historyPanel) {
        historyPanel.style.display = "none";
    }
}

function openWithdrawPanel() {

    closeWalletPanels();

    if (!withdrawPanel) return;

    withdrawPanel.style.display = "block";

    updateWithdrawBalance();

    withdrawPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function openHistoryPanel() {

    closeWalletPanels();

    if (!historyPanel) return;

    historyPanel.style.display = "block";

    renderTransactionHistory();

    historyPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

if (withdrawBtn) {

    withdrawBtn.addEventListener("click", function() {
        openWithdrawPanel();
    });

}

if (closeWithdrawBtn) {

    closeWithdrawBtn.addEventListener("click", function() {

        withdrawPanel.style.display = "none";

    });

}

if (closeHistoryBtn) {

    closeHistoryBtn.addEventListener("click", function() {

        historyPanel.style.display = "none";

    });

}

/* ==========================================
   15. PAYMENT METHOD
========================================== */

const withdrawMethodButtons =
    document.querySelectorAll(".withdraw-method");

withdrawMethodButtons.forEach(button => {

    button.addEventListener("click", function() {

        withdrawMethodButtons.forEach(method => {
            method.classList.remove("active");
        });

        this.classList.add("active");

        const method = this.dataset.method;

        if (selectedWithdrawMethodInput) {
            selectedWithdrawMethodInput.value = method;
        }

        if (withdrawAccountInput) {

            if (method === "USDT") {

                withdrawAccountInput.placeholder =
                    "Enter USDT wallet address";

            } else if (method === "bKash") {

                withdrawAccountInput.placeholder =
                    "Enter bKash number";

            } else {

                withdrawAccountInput.placeholder =
                    "Enter Nagad number";
            }
        }

    });

});

/* ==========================================
   16. WITHDRAWAL VALIDATION
========================================== */

function validateWithdrawal(amount, method, account) {

    if (!Number.isFinite(amount) || amount <= 0) {

        return {
            valid: false,
            message: "Please enter a valid withdrawal amount."
        };
    }

    if (amount < 50) {

        return {
            valid: false,
            message: "Minimum withdrawal amount is ৳50."
        };
    }

    if (amount > playerData.balance) {

        return {
            valid: false,
            message:
                "Insufficient Balance!\n\n" +
                "Available: " +
                formatMoney(playerData.balance)
        };
    }

    if (!method) {

        return {
            valid: false,
            message: "Please select a payment method."
        };
    }

    if (!account || account.trim().length < 5) {

        return {
            valid: false,
            message: "Please enter a valid payment account."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* ==========================================
   17. WITHDRAWAL SUBMISSION
========================================== */

if (submitWithdrawBtn) {

    submitWithdrawBtn.addEventListener("click", function() {

        const amount = Number(
            withdrawAmountInput.value
        );

        const method = selectedWithdrawMethodInput
            ? selectedWithdrawMethodInput.value
            : "";

        const account = withdrawAccountInput
            ? withdrawAccountInput.value.trim()
            : "";

        const validation = validateWithdrawal(
            amount,
            method,
            account
        );

        if (!validation.valid) {

            showNotification(
                "⚠️ " + validation.message
            );

            return;
        }

        const confirmation = confirm(

            "CONFIRM WITHDRAWAL\n\n" +
            "Amount: " + formatMoney(amount) +
            "\nPayment Method: " + method +
            "\nAccount: " + account +
            "\n\nRequest status: Pending\n\n" +
            "This is a demo request only.\n" +
            "No real payment will be sent."

        );

        if (!confirmation) return;

        if (amount > playerData.balance) {

            showNotification(
                "❌ Your balance is no longer sufficient."
            );

            return;
        }

        playerData.balance -= amount;

        createTransaction(
            "Withdrawal",
            amount,
            method + " • " + account,
            "Pending"
        );

        savePlayerData();
        updateDashboard();

        if (withdrawAmountInput) {
            withdrawAmountInput.value = "";
        }

        if (withdrawAccountInput) {
            withdrawAccountInput.value = "";
        }

        closeWalletPanels();

        showNotification(

            "✅ Withdrawal Request Created!\n\n" +
            "Amount: " + formatMoney(amount) +
            "\nMethod: " + method +
            "\nStatus: Pending\n\n" +
            "⚠️ DEMO ONLY\n" +
            "No real payment was sent."

        );

    });

}

/* ==========================================
   18. TRANSACTION HISTORY
========================================== */

const historyBtn =
    document.getElementById("historyBtn");

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderTransactionHistory() {

    const transactionList =
        document.getElementById("transactionList");

    if (!transactionList) return;

    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <div class="empty-state">
                <span>📜</span>
                <h3>No Transactions Yet</h3>
                <p>Your transaction history will appear here.</p>
            </div>
        `;

        return;
    }

    transactionList.innerHTML = transactions
        .map(transaction => {

            const isWithdrawal =
                transaction.type === "Withdrawal";

            const icon = isWithdrawal ? "💸" : "💰";

            const amountSign =
                isWithdrawal ? "-" : "+";

            const amountClass =
                isWithdrawal ? "negative" : "positive";

            const statusClass =
                String(transaction.status).toLowerCase();

            return `
                <div class="transaction-item">

                    <div class="transaction-icon">
                        ${icon}
                    </div>

                    <div class="transaction-info">

                        <strong>
                            ${escapeHTML(transaction.type)}
                        </strong>

                        <p>
                            ${escapeHTML(transaction.details)}
                        </p>

                        <small>
                            ${escapeHTML(transaction.date)}
                        </small>

                        <span class="transaction-status ${escapeHTML(statusClass)}">
                            ${escapeHTML(transaction.status)}
                        </span>

                    </div>

                    <div class="transaction-amount ${amountClass}">
                        ${amountSign}${formatMoney(transaction.amount)}
                    </div>

                </div>
            `;

        })
        .join("");
}

if (historyBtn) {

    historyBtn.addEventListener("click", function() {
        openHistoryPanel();
    });

}

/* ==========================================
   19. GAME BUTTONS
========================================== */

document.querySelectorAll(".game-btn").forEach(button => {

    button.addEventListener("click", function() {

        showNotification(
            "🎮 Game Development\n\n" +
            "This game is currently under development."
        );

    });

});

/* ==========================================
   20. TASK CATEGORY FILTER
========================================== */

document.querySelectorAll(".category-btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".category-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

    });

});

/* ==========================================
   21. EARNOVA GLOBAL API
========================================== */

window.EARNOVA = {

    player: playerData,

    addXP: function(amount) {
        addXP(amount);
    },

    addBalance: function(amount, source = "Reward") {
        return addDemoBalance(amount, source);
    },

    updateDashboard: function() {
        updateDashboard();
    },

    showPage: function(page) {
        showPage(page);
    },

    getTransactions: function() {
        return transactions;
    },

    getWallet: function() {
        return getWalletSummary();
    },

    addTaskReward: function(amount, taskName = "Task Reward") {

        playerData.tasksCompleted += 1;

        addDemoBalance(amount, taskName);

        savePlayerData();
        updateDashboard();
    },

    addReferralReward: function(amount, referralName = "Referral Reward") {

        playerData.referralCount += 1;
        playerData.referralEarnings += Number(amount);

        addDemoBalance(amount, referralName);

        savePlayerData();
        updateDashboard();
    },

    renderHistory: function() {
        renderTransactionHistory();
    },

    openWithdraw: function() {
        openWithdrawPanel();
    },

    openHistory: function() {
        openHistoryPanel();
    },

    logout: function() {
        logoutEarnova();
    },

    getFirebaseUser: function() {
        return currentFirebaseUser;
    }

};

/* ==========================================
   22. INITIALIZE APP
========================================== */

function initializeEarnova() {

    updateDashboard();

    renderTransactionHistory();

    console.log("EARNOVA App Initialized");
    console.log("Wallet System Ready");
    console.log("Withdrawal Interface Ready");
    console.log("Transaction History Ready");

    console.log("Player Data:", playerData);
    console.log("Transactions:", transactions);

}

/* ==========================================
   23. START APP
========================================== */

initializeEarnova();

async function startFirebaseSystem() {

    createAuthUI();

    const connected = await initializeFirebase();

    if (!connected) {

        authMessage(
            "Firebase connection failed. Check your internet.",
            "#ff7070"
        );

        return;
    }

    setupFirebaseAuthState();

}

startFirebaseSystem();