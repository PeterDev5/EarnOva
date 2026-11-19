
/* ==========================================
   EARNOVA ADMIN PANEL 3.0
   Dashboard • Post Manager • User Overview
   Withdrawal Overview • Local Statistics
========================================== */

"use strict";

(function () {
    const STORAGE_KEY = "earnova_admin_changes";
    const PLAYER_KEY = "earnova_player_data";
    const TRANSACTION_KEY = "earnova_transactions";

    const TYPES = {
        task: {
            title: "Tasks",
            getList: () => window.EARNOVA_TASKS || [],
            render: () => window.renderEarnovaTasks?.()
        },
        survey: {
            title: "Surveys",
            getList: () => window.EARNOVA_SURVEYS || [],
            render: () => window.renderEarnovaSurveys?.()
        },
        cpa: {
            title: "CPA Offers",
            getList: () => window.EARNOVA_CPA?.offers || [],
            render: () => window.EARNOVA_CPA?.render?.()
        },
        signup: {
            title: "Signup Offers",
            getList: () => window.EARNOVA_SIGNUP?.offers || [],
            render: () => window.EARNOVA_SIGNUP?.render?.()
        }
    };

    function readJSON(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch (e) {
            return fallback;
        }
    }

    function loadChanges() {
        return readJSON(STORAGE_KEY, {});
    }

    let changes = loadChanges();
    let selectedType = "task";
    let editingId = null;

    function saveChanges() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
    }

    function getChange(type) {
        if (!changes[type]) {
            changes[type] = {
                added: [],
                updated: [],
                deleted: []
            };
        }
        return changes[type];
    }

    function getPlayer() {
        return readJSON(PLAYER_KEY, {});
    }

    function getTransactions() {
        const data = readJSON(TRANSACTION_KEY, []);
        return Array.isArray(data) ? data : [];
    }

    function saveTransactions(data) {
        localStorage.setItem(TRANSACTION_KEY, JSON.stringify(data));
    }

    function applyChanges() {
        Object.keys(TYPES).forEach(type => {
            const list = TYPES[type].getList();
            const data = getChange(type);

            data.deleted.forEach(id => {
                const index = list.findIndex(
                    item => String(item.id) === String(id)
                );
                if (index !== -1) list.splice(index, 1);
            });

            data.updated.forEach(updated => {
                const index = list.findIndex(
                    item => String(item.id) === String(updated.id)
                );
                if (index !== -1) {
                    Object.assign(list[index], updated);
                }
            });

            data.added.forEach(item => {
                if (!list.some(x => String(x.id) === String(item.id))) {
                    list.push(item);
                }
            });
        });
    }

    function createId() {
        return "admin_" + Date.now() + "_" +
            Math.random().toString(36).slice(2, 7);
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function savePost(type, item) {
        const list = TYPES[type].getList();
        const data = getChange(type);

        const existing = list.find(
            x => String(x.id) === String(item.id)
        );

        if (existing) {
            Object.assign(existing, item);

            const addedIndex = data.added.findIndex(
                x => String(x.id) === String(item.id)
            );

            if (addedIndex !== -1) {
                data.added[addedIndex] = item;
            } else {
                const updatedIndex = data.updated.findIndex(
                    x => String(x.id) === String(item.id)
                );

                if (updatedIndex !== -1) {
                    data.updated[updatedIndex] = item;
                } else {
                    data.updated.push(item);
                }
            }
        } else {
            list.push(item);
            data.added.push(item);
        }

        data.deleted = data.deleted.filter(
            id => String(id) !== String(item.id)
        );

        saveChanges();
        refreshSections();
    }

    function deletePost(type, id) {
        const list = TYPES[type].getList();
        const data = getChange(type);

        const index = list.findIndex(
            x => String(x.id) === String(id)
        );

        if (index === -1) return;

        list.splice(index, 1);

        data.added = data.added.filter(
            x => String(x.id) !== String(id)
        );

        data.updated = data.updated.filter(
            x => String(x.id) !== String(id)
        );

        if (!data.deleted.some(x => String(x) === String(id))) {
            data.deleted.push(id);
        }

        saveChanges();
        refreshSections();
    }

    function getTotal(type) {
        return TYPES[type].getList().length;
    }

    function refreshSections() {
        Object.keys(TYPES).forEach(type => TYPES[type].render());
        renderAdmin();
    }

    function addAdminButton() {
        if (document.getElementById("earnovaOpenAdmin")) return;

        const profile = document.getElementById("profileSection");
        if (!profile) return;

        const button = document.createElement("button");
        button.id = "earnovaOpenAdmin";
        button.textContent = "⚙️ Admin Panel";
        button.style.cssText =
            "width:100%;padding:15px;margin:15px 0;" +
            "border:0;border-radius:12px;background:#123d2a;" +
            "color:white;font-size:16px;font-weight:bold;";

        button.onclick = showAdmin;
        profile.appendChild(button);
    }

    function showAdmin() {
        document.querySelectorAll(".section").forEach(section => {
            section.classList.remove("active");
        });

        const main = document.getElementById("mainContent");
        if (!main) return;

        let panel = document.getElementById("earnovaAdminSection");

        if (!panel) {
            panel = document.createElement("section");
            panel.id = "earnovaAdminSection";
            panel.className = "section";
            main.appendChild(panel);
        }

        panel.classList.add("active");
        renderAdmin();
    }

    function adminHeader() {
        return `
            <h2>⚙️ EARNOVA Admin 3.0</h2>
            <p style="color:#aaa;">Administration Dashboard</p>

            <div style="
                display:grid;
                grid-template-columns:repeat(2,1fr);
                gap:8px;
                margin:18px 0;
            ">
                <button onclick="window.EARNOVA_ADMIN.dashboard()"
                    style="${navStyle()}">Dashboard</button>
                <button onclick="window.EARNOVA_ADMIN.users()"
                    style="${navStyle()}">Users</button>
                <button onclick="window.EARNOVA_ADMIN.withdrawals()"
                    style="${navStyle()}">Withdrawals</button>
                <button onclick="window.EARNOVA_ADMIN.tasksApproval()"
                    style="${navStyle()}">Task Approval</button>
                <button onclick="window.EARNOVA_ADMIN.posts()"
                    style="${navStyle()}">Post Manager</button>
            </div>
            <div id="earnovaAdminContent"></div>
        `;
    }

    function navStyle() {
        return `
            padding:12px 5px;
            border:0;
            border-radius:9px;
            background:#174a32;
            color:white;
            font-weight:bold;
        `;
    }

    function cardStyle() {
        return `
            background:#10251c;
            padding:15px;
            border-radius:12px;
            min-width:0;
        `;
    }

    function renderAdmin() {
        const panel = document.getElementById("earnovaAdminSection");
        if (!panel) return;

        panel.innerHTML = `
            <div style="padding:16px;color:white;">
                ${adminHeader()}
            </div>
        `;

        dashboard();
    }

    function getWithdrawals() {
        return getTransactions().filter(item => {
            const type = String(
                item.type || item.category || item.title || ""
            ).toLowerCase();

            return type.includes("withdraw") ||
                type.includes("payout");
        });
    }

    function dashboard() {
        const content = document.getElementById("earnovaAdminContent");
        if (!content) return;

        const player = getPlayer();
        const transactions = getTransactions();

        const totalPosts = Object.keys(TYPES).reduce(
            (sum, type) => sum + getTotal(type), 0
        );

        content.innerHTML = `
            <h3>📊 Dashboard Overview</h3>

            <div style="
                display:grid;
                grid-template-columns:repeat(2,1fr);
                gap:10px;
            ">
                <div style="${cardStyle()}">
                    <small style="color:#aaa;">Local User</small>
                    <h2>1</h2>
                </div>

                <div style="${cardStyle()}">
                    <small style="color:#aaa;">Total Posts</small>
                    <h2>${totalPosts}</h2>
                </div>

                <div style="${cardStyle()}">
                    <small style="color:#aaa;">Current Balance</small>
                    <h2>৳${escapeHTML(player.balance || 0)}</h2>
                </div>

                <div style="${cardStyle()}">
                    <small style="color:#aaa;">Total Earnings</small>
                    <h2>৳${escapeHTML(player.totalEarnings || 0)}</h2>
                </div>

                <div style="${cardStyle()}">
                    <small style="color:#aaa;">Transactions</small>
                    <h2>${transactions.length}</h2>
                </div>

                <div style="${cardStyle()}">
                    <small style="color:#aaa;">Withdrawal Records</small>
                    <h2>${getWithdrawals().length}</h2>
                </div>
            </div>

            <p style="
                color:#f0c674;
                background:#302719;
                padding:12px;
                border-radius:9px;
                margin-top:15px;
                font-size:13px;
            ">
                Demo mode: এখানে শুধু এই ডিভাইসের Local Data দেখানো হচ্ছে।
            </p>
        `;
    }

    function users() {
        const content = document.getElementById("earnovaAdminContent");
        if (!content) return;

        const player = getPlayer();

        content.innerHTML = `
            <h3>👤 User Overview</h3>

            <div style="${cardStyle()}">
                <p><b>Username:</b>
                    ${escapeHTML(player.username || "Local User")}
                </p>
                <p><b>User ID:</b>
                    ${escapeHTML(player.userId || "Not available")}
                </p>
                <p><b>Balance:</b>
                    ৳${escapeHTML(player.balance || 0)}
                </p>
                <p><b>Total Earnings:</b>
                    ৳${escapeHTML(player.totalEarnings || 0)}
                </p>
                <p><b>XP:</b> ${escapeHTML(player.xp || 0)}</p>
                <p><b>Tasks Completed:</b>
                    ${escapeHTML(player.tasksCompleted || 0)}
                </p>
                <p><b>Games Played:</b>
                    ${escapeHTML(player.gamesPlayed || 0)}
                </p>
                <p><b>Referral Count:</b>
                    ${escapeHTML(player.referralCount || 0)}
                </p>
            </div>

            <p style="color:#aaa;font-size:13px;margin-top:12px;">
                এটি শুধু বর্তমান ডিভাইসের Local User Profile।
                একাধিক ইউজার পরিচালনার জন্য Backend প্রয়োজন।
            </p>
        `;
    }

    function withdrawals() {
        const content = document.getElementById("earnovaAdminContent");
        if (!content) return;

        const list = getWithdrawals();

        content.innerHTML = `
            <h3>💸 Withdrawal Overview</h3>

            ${
                list.length
                ? list.map((item, index) => `
                    <div style="${cardStyle()}margin-bottom:10px;">
                        <b>${escapeHTML(item.title || item.type || "Withdrawal")}</b>
                        <p>Amount: ৳${escapeHTML(item.amount || item.reward || 0)}</p>
                        <p>Status: ${escapeHTML(item.status || "Pending")}</p>
                        <p style="color:#aaa;font-size:12px;">
                            ${escapeHTML(item.date || item.createdAt || "")}
                        </p>

                        <select
                            id="withdrawStatus${index}"
                            style="${inputStyle()}">
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Paid">Paid</option>
                        </select>

                        <button
                            onclick="window.EARNOVA_ADMIN.updateWithdrawal(${index})"
                            style="${buttonStyle()}">
                            Update Status
                        </button>
                    </div>
                `).join("")
                : `<p style="color:#aaa;">এই ডিভাইসে কোনো Withdrawal Record পাওয়া যায়নি।</p>`
            }

            <p style="color:#f0c674;font-size:12px;">
                Status পরিবর্তন শুধু Local Record-এ হবে।
                এটি বাস্তব পেমেন্ট পাঠাবে না।
            </p>
        `;

        list.forEach((item, index) => {
            const select = document.getElementById(
                "withdrawStatus" + index
            );

            if (select) {
                select.value = item.status || "Pending";
            }
        });
    }

    function updateWithdrawal(index) {
        const list = getWithdrawals();
        const item = list[index];

        if (!item) return;

        const select = document.getElementById(
            "withdrawStatus" + index
        );

        if (!select) return;

        const transactions = getTransactions();
        const originalIndex = transactions.indexOf(item);

        if (originalIndex === -1) return;

        transactions[originalIndex].status = select.value;
        saveTransactions(transactions);

        alert("Withdrawal status updated locally!");
        withdrawals();
    }

    function tasksApproval() {
        const content = document.getElementById("earnovaAdminContent");
        if (!content) return;

        content.innerHTML = `
            <h3>✅ Task Approval</h3>

            <div style="${cardStyle()}">
                <h4>Task Submission System</h4>
                <p style="color:#aaa;">
                    এখনো User Task Submission Queue সংযুক্ত নেই।
                </p>
                <p style="color:#f0c674;font-size:13px;">
                    ইউজারের জমা দেওয়া কাজ Approve/Reject করার জন্য
                    Firebase বা Backend Submission System তৈরি করতে হবে।
                </p>
            </div>
        `;
    }

    function posts() {
        const content = document.getElementById("earnovaAdminContent");
        if (!content) return;

        content.innerHTML = `
            <h3>📝 Post Manager</h3>

            <div style="
                display:grid;
                grid-template-columns:repeat(2,1fr);
                gap:8px;
                margin-bottom:15px;
            ">
                ${Object.keys(TYPES).map(type => `
                    <button
                        onclick="window.EARNOVA_ADMIN.select('${type}')"
                        style="${navStyle()}">
                        ${TYPES[type].title}
                    </button>
                `).join("")}
            </div>

            <div id="earnovaAdminEditor"></div>
            <div id="earnovaAdminPosts"></div>
        `;

        selectType("task");
    }

    function inputStyle() {
        return `
            width:100%;
            box-sizing:border-box;
            padding:13px;
            margin:7px 0;
            border:1px solid #31503f;
            border-radius:9px;
            background:#07130d;
            color:white;
        `;
    }

    function buttonStyle() {
        return `
            width:100%;
            padding:13px;
            margin-top:8px;
            border:0;
            border-radius:9px;
            background:#16834b;
            color:white;
            font-weight:bold;
        `;
    }

    function selectType(type) {
        selectedType = type;
        editingId = null;

        const editor = document.getElementById("earnovaAdminEditor");
        const posts = document.getElementById("earnovaAdminPosts");

        if (!editor || !posts) return;

        editor.innerHTML = `
            <div style="${cardStyle()}margin-bottom:18px;">
                <h3 id="earnovaFormTitle">Add ${TYPES[type].title}</h3>

                <input id="adminTitle" placeholder="Post title"
                    style="${inputStyle()}">

                <input id="adminDescription" placeholder="Description"
                    style="${inputStyle()}">

                <input id="adminReward" type="number" min="0"
                    placeholder="Reward (৳)"
                    style="${inputStyle()}">

                <input id="adminXP" type="number" min="0"
                    placeholder="XP reward"
                    style="${inputStyle()}">

                <input id="adminCategory" placeholder="Category"
                    style="${inputStyle()}">

                <input id="adminQuestions"
                    placeholder="Survey questions (separate with |)"
                    style="${inputStyle()}">

                <button onclick="window.EARNOVA_ADMIN.save()"
                    style="${buttonStyle()}">Save Post</button>

                <button onclick="window.EARNOVA_ADMIN.cancel()"
                    style="${buttonStyle()}background:#444;">
                    Cancel
                </button>
            </div>
        `;

        renderPosts();
    }

    function renderPosts() {
        const posts = document.getElementById("earnovaAdminPosts");
        if (!posts) return;

        const list = TYPES[selectedType].getList();

        posts.innerHTML = `
            <h3>${TYPES[selectedType].title} List (${list.length})</h3>

            ${list.map(item => `
                <div style="${cardStyle()}margin:10px 0;">
                    <strong>${escapeHTML(item.title)}</strong>
                    <p style="color:#aaa;">
                        Reward: ৳${escapeHTML(item.reward || 0)}
                    </p>

                    <button
                        onclick="window.EARNOVA_ADMIN.edit('${escapeHTML(item.id)}')"
                        style="padding:9px 13px;background:#176b9b;color:white;border:0;border-radius:7px;">
                        Edit
                    </button>

                    <button
                        onclick="window.EARNOVA_ADMIN.remove('${escapeHTML(item.id)}')"
                        style="padding:9px 13px;background:#a83232;color:white;border:0;border-radius:7px;">
                        Delete
                    </button>
                </div>
            `).join("")}
        `;
    }

    function editPost(id) {
        const item = TYPES[selectedType].getList().find(
            x => String(x.id) === String(id)
        );

        if (!item) return;

        editingId = id;

        document.getElementById("earnovaFormTitle").textContent =
            "Edit " + TYPES[selectedType].title;

        document.getElementById("adminTitle").value = item.title || "";
        document.getElementById("adminDescription").value =
            item.description || "";
        document.getElementById("adminReward").value = item.reward || 0;
        document.getElementById("adminXP").value = item.xp || 0;
        document.getElementById("adminCategory").value =
            item.category || item.type || "";

        const questions = Array.isArray(item.questions)
            ? item.questions.map(q =>
                typeof q === "string"
                    ? q
                    : q.question || q.text || q.title || ""
            ).join(" | ")
            : "";

        document.getElementById("adminQuestions").value = questions;
    }

    function saveForm() {
        const title = document.getElementById("adminTitle").value.trim();

        if (!title) {
            alert("Please enter a post title.");
            return;
        }

        const description =
            document.getElementById("adminDescription").value.trim();

        const reward = Number(
            document.getElementById("adminReward").value
        ) || 0;

        const xp = Number(
            document.getElementById("adminXP").value
        ) || 0;

        const category =
            document.getElementById("adminCategory").value.trim() || "General";

        const oldItem = editingId
            ? TYPES[selectedType].getList().find(
                x => String(x.id) === String(editingId)
            )
            : null;

        const item = oldItem ? { ...oldItem } : {
            id: createId(),
            time: "5 Minutes",
            icon: "⭐"
        };

        item.title = title;
        item.description = description;
        item.reward = reward;
        item.xp = xp;
        item.category = category;

        if (selectedType === "survey") {
            const lines = document.getElementById("adminQuestions")
                .value.split("|")
                .map(x => x.trim())
                .filter(Boolean);

            const template = TYPES.survey.getList()[0]?.questions || [];

            item.questions = lines.map((line, index) => {
                const original = template[index];

                if (typeof original === "string" || !original) {
                    return line;
                }

                const question = { ...original };
                const key = ["question", "text", "title", "prompt"]
                    .find(k => typeof question[k] === "string");

                if (key) question[key] = line;
                return question;
            });

            if (!item.questions.length && template.length) {
                item.questions = template.map(q =>
                    typeof q === "string" ? q : { ...q }
                );
            }
        }

        savePost(selectedType, item);
        editingId = null;
        alert("Post saved!");
    }

    function cancelEdit() {
        editingId = null;
        selectType(selectedType);
    }

    function removePost(id) {
        if (!confirm("Delete this post?")) return;
        deletePost(selectedType, id);
    }

    applyChanges();

    window.EARNOVA_ADMIN = {
        select: selectType,
        save: saveForm,
        edit: editPost,
        remove: removePost,
        cancel: cancelEdit,
        open: showAdmin,
        dashboard,
        users,
        withdrawals,
        updateWithdrawal,
        tasksApproval,
        posts
    };

    addAdminButton();
    document.addEventListener("DOMContentLoaded", addAdminButton);

    console.log("EARNOVA Admin Panel 3.0 loaded");
})();
