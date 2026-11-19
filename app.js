
/* ==========================================
   EARNOVA APP ENGINE 5.0
   Telegram Auto Authentication
   Firebase • Dashboard • Wallet • XP
   Withdrawal • Transactions • Referral
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

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDB = null;
let currentFirebaseUser = null;
let telegramUser = null;

/* ==========================================
   2. STORAGE
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
    userId: "Player",
    notifications: []
};

function loadPlayerData() {
    try {
        const saved = localStorage.getItem(EARNOVA_STORAGE_KEY);

        return saved
            ? { ...defaultPlayerData, ...JSON.parse(saved) }
            : { ...defaultPlayerData };

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

/* ==========================================
   3. COMMON UTILITIES
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

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================
   4. AUTHENTICATION SCREEN
========================================== */

function createAuthScreen() {
    if (document.getElementById("earnovaAuthScreen")) return;

    const screen = document.createElement("div");
    screen.id = "earnovaAuthScreen";

    screen.innerHTML = `
        <div class="earnova-loading-card">
            <div class="earnova-loading-logo">E</div>
            <h2>EARNOVA</h2>
            <p id="earnovaAuthStatus">Connecting to Telegram...</p>
            <div class="earnova-loader"></div>
        </div>
    `;

    document.body.appendChild(screen);

    const style = document.createElement("style");

    style.textContent = `
        #earnovaAuthScreen {
            position: fixed;
            inset: 0;
            z-index: 9999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: #06100b;
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
        }

        .earnova-loading-card {
            width: 100%;
            max-width: 360px;
            padding: 35px 25px;
            border-radius: 22px;
            background: #0d1b13;
            border: 1px solid #1d4430;
        }

        .earnova-loading-logo {
            width: 65px;
            height: 65px;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 19px;
            background: #16a34a;
            font-size: 35px;
            font-weight: bold;
        }

        .earnova-loading-card h2 {
            color: #4ade80;
            letter-spacing: 3px;
            margin: 18px 0 10px;
        }

        .earnova-loading-card p {
            color: #a7b9ad;
            font-size: 14px;
            overflow-wrap: anywhere;
        }

        .earnova-loader {
            width: 28px;
            height: 28px;
            margin: 22px auto 0;
            border: 3px solid #244532;
            border-top-color: #4ade80;
            border-radius: 50%;
            animation: earnovaSpin .8s linear infinite;
        }

        @keyframes earnovaSpin {
            to { transform: rotate(360deg); }
        }

        .earnova-auth-error {
            color: #ff7777 !important;
            line-height: 1.6;
        }

        .earnova-retry-btn {
            margin-top: 15px;
            padding: 12px 22px;
            background: #16a34a;
            border: 0;
            border-radius: 9px;
            color: white;
            font-weight: bold;
        }
    `;

    document.head.appendChild(style);
}

function setAuthStatus(message, isError = false) {
    const status = document.getElementById("earnovaAuthStatus");

    if (status) {
        status.textContent = message;
        status.className = isError ? "earnova-auth-error" : "";
    }
}

function showAuthError(message) {
    setAuthStatus(message, true);

    const card = document.querySelector(".earnova-loading-card");

    if (card && !document.getElementById("earnovaRetryBtn")) {
        const button = document.createElement("button");

        button.id = "earnovaRetryBtn";
        button.className = "earnova-retry-btn";
        button.textContent = "Try Again";

        button.onclick = () => {
            location.reload();
        };

        card.appendChild(button);
    }

    const loader = document.querySelector(".earnova-loader");

    if (loader) loader.style.display = "none";
}

function hideAuthScreen() {
    const screen = document.getElementById("earnovaAuthScreen");

    if (screen) screen.style.display = "none";
}

/* ==========================================
   5. FIREBASE SDK
========================================== */

function loadFirebaseSDK() {
    return new Promise((resolve, reject) => {

        if (window.firebase && window.firebase.auth &&
            window.firebase.firestore) {
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
    await loadFirebaseSDK();

    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
        firebaseApp = firebase.app();
    }

    firebaseAuth = firebase.auth();
    firebaseDB = firebase.firestore();

    console.log("Firebase Connected");
}

/* ==========================================
   6. TELEGRAM AUTHENTICATION
========================================== */

async function authenticateWithTelegram() {

    const tg = window.Telegram && window.Telegram.WebApp;

    if (!tg) {
        throw new Error(
            "Telegram SDK not found. Open EARNOVA from Telegram."
        );
    }

    tg.ready();
    tg.expand();

    const initData = tg.initData;

    if (!initData) {
        throw new Error(
            "Telegram authentication data missing. Open EARNOVA using the Telegram bot menu."
        );
    }

    setAuthStatus("Verifying your Telegram account...");

    const response = await fetch(EARNOVA_AUTH_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            initData: initData
        })
    });

    let result;

    try {
        result = await response.json();
    } catch (error) {
        throw new Error("Invalid authentication server response.");
    }

    if (!response.ok) {
        throw new Error(
            result.error || "Telegram authentication failed."
        );
    }

    if (!result.customToken || !result.user || !result.user.id) {
        throw new Error("Authentication response is incomplete.");
    }

    telegramUser = result.user;

    setAuthStatus("Connecting your EARNOVA account...");

    const credential = await firebaseAuth.signInWithCustomToken(
        result.customToken
    );

    currentFirebaseUser = credential.user;

    if (!currentFirebaseUser) {
        throw new Error("Firebase authentication failed.");
    }

    const expectedUID = "tg_" + String(result.user.id);

    if (currentFirebaseUser.uid !== expectedUID) {
        await firebaseAuth.signOut();
        throw new Error("Telegram account verification mismatch.");
    }

    return result.user;
}

/* ==========================================
   7. FIREBASE USER PROFILE
========================================== */

async function loadFirebaseUserProfile(user) {

    if (!firebaseDB || !user) return;

    const docRef = firebaseDB
        .collection("users")
        .doc(user.uid);

    try {
        const doc = await docRef.get();

        if (doc.exists) {
            const profile = doc.data();

            playerData.username =
                profile.name ||
                telegramUser.firstName ||
                "Player";

        } else {
            const name =
                telegramUser.firstName || "Player";

            const profile = {
                uid: user.uid,
                name: name,
                email: "",
                createdAt: new Date().toISOString()
            };

            try {
                await docRef.set(profile);
            } catch (writeError) {
                console.warn(
                    "Profile creation unavailable:",
                    writeError
                );
            }

            playerData.username = name;
        }

    } catch (error) {
        console.warn("Profile loading error:", error);

        playerData.username =
            telegramUser.firstName || "Player";
    }

    playerData.userId = String(telegramUser.id);

    savePlayerData();
    updateDashboard();
}

/* ==========================================
   8. AUTHENTICATION START
========================================== */

async function startFirebaseSystem() {

    createAuthScreen();

    try {
        setAuthStatus("Connecting to Firebase...");

        await initializeFirebase();

        await authenticateWithTelegram();

        await loadFirebaseUserProfile(currentFirebaseUser);

        setAuthStatus("EARNOVA is ready...");

        initializeEarnova();

        hideAuthScreen();

        console.log(
            "EARNOVA Telegram Authentication Successful:",
            currentFirebaseUser.uid
        );

    } catch (error) {
        console.error("EARNOVA Authentication Error:", error);

        showAuthError(
            error.message || "Authentication failed."
        );
    }
}

async function logoutEarnova() {
    showNotification(
        "To use EARNOVA, reopen it from your Telegram bot."
    );
}

/* ==========================================
   9. TRANSACTION SYSTEM
========================================== */

function createTransaction(
    type,
    amount,
    details,
    status = "Completed"
) {
    const transaction = {
        id: "TX-" + Date.now(),
        type: type,
        amount: Number(amount),
        details: details,
        status: status,
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
   10. XP SYSTEM
========================================== */

function addXP(amount) {
    amount = Number(amount) || 0;

    playerData.xp += amount;

    savePlayerData();
    updateDashboard();
}

/* ==========================================
   11. DEMO EARNINGS
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
   12. DASHBOARD
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

    if (elements.balance)
        elements.balance.textContent = formatMoney(playerData.balance);

    if (elements.walletBalance)
        elements.walletBalance.textContent = formatMoney(playerData.balance);

    if (elements.xp)
        elements.xp.textContent = playerData.xp + " XP";

    if (elements.games)
        elements.games.textContent = playerData.gamesPlayed;

    if (elements.tasks)
        elements.tasks.textContent = playerData.tasksCompleted;

    if (elements.earnings)
        elements.earnings.textContent = formatMoney(playerData.todayEarnings);

    if (elements.streak)
        elements.streak.textContent = playerData.streak + " Days";

    if (elements.referralCount)
        elements.referralCount.textContent = playerData.referralCount;

    if (elements.referralEarnings)
        elements.referralEarnings.textContent =
            formatMoney(playerData.referralEarnings);

    if (elements.totalEarnings)
        elements.totalEarnings.textContent =
            formatMoney(playerData.totalEarnings);

    if (elements.username)
        elements.username.textContent = playerData.username;

    if (elements.profileName)
        elements.profileName.textContent = playerData.username;

    if (elements.profileId)
        elements.profileId.textContent = "User ID: " + playerData.userId;

    updateWithdrawBalance();
}

/* ==========================================
   13. NAVIGATION
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

    const targetSection = document.getElementById(sectionId);

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
   14. REFERRAL
========================================== */

function getReferralLink() {
    return "EARNOVA Referral ID: " + playerData.userId;
}

const copyReferralBtn =
    document.getElementById("copyReferralBtn");

const referralLinkElement =
    document.getElementById("referralLink");

if (referralLinkElement) {
    referralLinkElement.textContent = getReferralLink();
}

if (copyReferralBtn) {
    copyReferralBtn.addEventListener("click", async function() {

        const link = getReferralLink();

        try {
            await navigator.clipboard.writeText(link);
            showNotification("Referral ID copied!");
        } catch (error) {
            showNotification(link);
        }
    });
}

/* ==========================================
   15. NOTIFICATIONS
========================================== */

const notificationBtn =
    document.getElementById("notificationBtn");

if (notificationBtn) {
    notificationBtn.addEventListener("click", function() {
        showNotification(
            "EARNOVA Notifications\n\nYou are all caught up!"
        );
    });
}

/* ==========================================
   16. WALLET
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
   17. WITHDRAWAL INTERFACE
========================================== */

const withdrawBtn = document.getElementById("withdrawBtn");
const withdrawPanel = document.getElementById("withdrawPanel");
const historyPanel = document.getElementById("historyPanel");
const closeWithdrawBtn = document.getElementById("closeWithdrawBtn");
const closeHistoryBtn = document.getElementById("closeHistoryBtn");
const withdrawAmountInput = document.getElementById("withdrawAmount");
const withdrawAccountInput = document.getElementById("withdrawAccount");
const selectedWithdrawMethodInput =
    document.getElementById("selectedWithdrawMethod");
const submitWithdrawBtn = document.getElementById("submitWithdrawBtn");

function closeWalletPanels() {
    if (withdrawPanel) withdrawPanel.style.display = "none";
    if (historyPanel) historyPanel.style.display = "none";
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
    withdrawBtn.addEventListener("click", openWithdrawPanel);
}

if (closeWithdrawBtn) {
    closeWithdrawBtn.addEventListener("click", () => {
        if (withdrawPanel) withdrawPanel.style.display = "none";
    });
}

if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener("click", () => {
        if (historyPanel) historyPanel.style.display = "none";
    });
}

/* ==========================================
   18. PAYMENT METHOD
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
   19. WITHDRAWAL VALIDATION
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
            message: "Insufficient Balance! Available: " +
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

    return { valid: true, message: "" };
}

/* ==========================================
   20. WITHDRAWAL SUBMISSION
========================================== */

if (submitWithdrawBtn) {

    submitWithdrawBtn.addEventListener("click", function() {

        const amount = Number(
            withdrawAmountInput ? withdrawAmountInput.value : 0
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
            showNotification(validation.message);
            return;
        }

        const confirmation = confirm(
            "CONFIRM WITHDRAWAL\n\n" +
            "Amount: " + formatMoney(amount) +
            "\nPayment Method: " + method +
            "\nAccount: " + account +
            "\n\nDEMO REQUEST ONLY.\nNo real payment will be sent."
        );

        if (!confirmation) return;

        playerData.balance -= amount;

        createTransaction(
            "Withdrawal",
            amount,
            method + " • " + account,
            "Pending"
        );

        savePlayerData();
        updateDashboard();

        if (withdrawAmountInput) withdrawAmountInput.value = "";
        if (withdrawAccountInput) withdrawAccountInput.value = "";

        closeWalletPanels();

        showNotification(
            "Withdrawal request created.\n\n" +
            "Amount: " + formatMoney(amount) +
            "\nStatus: Pending\n\n" +
            "DEMO ONLY — No real payment was sent."
        );
    });
}

/* ==========================================
   21. TRANSACTION HISTORY
========================================== */

const historyBtn = document.getElementById("historyBtn");

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

    transactionList.innerHTML = transactions.map(transaction => {

        const isWithdrawal =
            transaction.type === "Withdrawal";

        const icon = isWithdrawal ? "💸" : "💰";
        const amountSign = isWithdrawal ? "-" : "+";
        const amountClass = isWithdrawal ? "negative" : "positive";
        const statusClass =
            String(transaction.status).toLowerCase();

        return `
            <div class="transaction-item">
                <div class="transaction-icon">${icon}</div>

                <div class="transaction-info">
                    <strong>${escapeHTML(transaction.type)}</strong>
                    <p>${escapeHTML(transaction.details)}</p>
                    <small>${escapeHTML(transaction.date)}</small>
                    <span class="transaction-status ${escapeHTML(statusClass)}">
                        ${escapeHTML(transaction.status)}
                    </span>
                </div>

                <div class="transaction-amount ${amountClass}">
                    ${amountSign}${formatMoney(transaction.amount)}
                </div>
            </div>
        `;

    }).join("");
}

if (historyBtn) {
    historyBtn.addEventListener("click", openHistoryPanel);
}

/* ==========================================
   22. GAME BUTTONS
========================================== */

document.querySelectorAll(".game-btn").forEach(button => {
    button.addEventListener("click", function() {
        showNotification(
            "This game is currently under development."
        );
    });
});

/* ==========================================
   23. TASK CATEGORY FILTER
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
   24. EARNOVA GLOBAL API
========================================== */

window.EARNOVA = {

    get player() {
        return playerData;
    },

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
    },

    getTelegramUser: function() {
        return telegramUser;
    }
};

/* ==========================================
   25. INITIALIZE APP
========================================== */

function initializeEarnova() {

    updateDashboard();
    renderTransactionHistory();

    console.log("EARNOVA App Initialized");
    console.log("Telegram Authentication Ready");
    console.log("Wallet Interface Ready");
    console.log("Withdrawal Interface Ready");
    console.log("Transaction History Ready");
}

/* ==========================================
   26. START
========================================== */

startFirebaseSystem();
