/* ==========================================
   EARNOVA SIGNUP SYSTEM 1.0
   Registration Offers
========================================== */

"use strict";

(function () {

    const STORAGE_KEY = "earnova_signup_data";

    const signupOffers = [

        {
            id: "signup_001",
            title: "Email Registration",
            description: "Complete a demo email registration task.",
            reward: 15,
            time: "2 Minutes",
            category: "Email",
            icon: "📧"
        },

        {
            id: "signup_002",
            title: "Learning Platform Signup",
            description: "Explore an educational platform registration.",
            reward: 30,
            time: "5 Minutes",
            category: "Education",
            icon: "🎓"
        },

        {
            id: "signup_003",
            title: "Community Registration",
            description: "Complete a community signup activity.",
            reward: 25,
            time: "4 Minutes",
            category: "Community",
            icon: "👥"
        },

        {
            id: "signup_004",
            title: "Newsletter Registration",
            description: "Explore a newsletter subscription activity.",
            reward: 10,
            time: "1 Minute",
            category: "Newsletter",
            icon: "📰"
        },

        {
            id: "signup_005",
            title: "Digital Service Signup",
            description: "Explore a digital service registration.",
            reward: 35,
            time: "5 Minutes",
            category: "Service",
            icon: "💼"
        },

        {
            id: "signup_006",
            title: "Shopping Platform Signup",
            description: "Explore an online shopping registration.",
            reward: 20,
            time: "3 Minutes",
            category: "Shopping",
            icon: "🛍️"
        }

    ];

    /* STORAGE */

    function getData() {

        try {

            return JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || {
                started: [],
                completed: []
            };

        } catch (error) {

            return {
                started: [],
                completed: []
            };

        }

    }

    function saveData(data) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

    }

    /* STATUS */

    function getStatus(id) {

        const data = getData();

        if (data.completed.includes(id)) {
            return "completed";
        }

        if (data.started.includes(id)) {
            return "started";
        }

        return "available";

    }

    /* CARD */

    function createCard(offer) {

        const status = getStatus(offer.id);

        let buttonText = "📝 Start Registration";
        let action = "start";
        let buttonColor = "#16a34a";

        if (status === "started") {

            buttonText = "✅ Complete Demo";
            action = "complete";
            buttonColor = "#2563eb";

        }

        if (status === "completed") {

            buttonText = "✔ Completed";
            action = "completed";
            buttonColor = "#374151";

        }

        return `

            <div style="
                background:#101d16;
                border:1px solid #233b2e;
                border-radius:16px;
                padding:18px;
                margin-bottom:14px;
            ">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:12px;
                ">

                    <div style="
                        width:50px;
                        height:50px;
                        background:#1b3024;
                        border-radius:14px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:27px;
                    ">
                        ${offer.icon}
                    </div>

                    <div style="flex:1">

                        <h3 style="
                            color:white;
                            margin:0 0 5px;
                        ">
                            ${offer.title}
                        </h3>

                        <small style="color:#8fa797">
                            ${offer.category}
                        </small>

                    </div>

                </div>

                <p style="
                    color:#a5b5aa;
                    font-size:13px;
                    line-height:1.6;
                    margin:15px 0;
                ">
                    ${offer.description}
                </p>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    margin-bottom:15px;
                ">

                    <span style="color:#8fa797">
                        ⏱ ${offer.time}
                    </span>

                    <strong style="color:#43e58c">
                        +${offer.reward} Coins
                    </strong>

                </div>

                <button
                    class="earnova-signup-action"
                    data-id="${offer.id}"
                    data-action="${action}"
                    ${action === "completed" ? "disabled" : ""}
                    style="
                        width:100%;
                        padding:13px;
                        border:none;
                        border-radius:11px;
                        color:white;
                        background:${buttonColor};
                        font-weight:bold;
                    "
                >
                    ${buttonText}
                </button>

            </div>

        `;

    }

    /* RENDER */

    function render() {

        const section = document.getElementById("signupSection");

        if (!section) return;

        const data = getData();

        const completedCount = signupOffers.filter(
            offer => data.completed.includes(offer.id)
        ).length;

        section.innerHTML = `

            <div class="page-heading">
                <h2>📝 Sign Up Offers</h2>
                <p>Discover registration opportunities</p>
            </div>

            <div style="
                display:flex;
                gap:12px;
                margin-bottom:20px;
            ">

                <div style="
                    flex:1;
                    background:#11251a;
                    padding:15px;
                    border-radius:14px;
                    text-align:center;
                ">

                    <small style="color:#9aafa2">
                        Total Offers
                    </small>

                    <h2 style="color:#42e58c;margin:8px 0">
                        ${signupOffers.length}
                    </h2>

                </div>

                <div style="
                    flex:1;
                    background:#11251a;
                    padding:15px;
                    border-radius:14px;
                    text-align:center;
                ">

                    <small style="color:#9aafa2">
                        Completed
                    </small>

                    <h2 style="color:#42e58c;margin:8px 0">
                        ${completedCount}
                    </h2>

                </div>

            </div>

            <div style="
                background:#332718;
                border:1px solid #66502b;
                padding:12px;
                border-radius:12px;
                margin-bottom:18px;
                color:#e9c887;
                font-size:12px;
            ">
                ⚠️ Demo signup offers. Real registration
                verification and payment are not connected.
            </div>

            <div id="signupOfferList">

                ${signupOffers.map(createCard).join("")}

            </div>

        `;

    }

    /* START */

    function startOffer(id) {

        const data = getData();

        if (data.completed.includes(id)) {
            return;
        }

        if (!data.started.includes(id)) {
            data.started.push(id);
        }

        saveData(data);

        render();

        alert(
            "Registration Offer Started!\n\n" +
            "This is a demonstration offer."
        );

    }

    /* COMPLETE DEMO */

    function completeOffer(id) {

        const data = getData();

        if (data.completed.includes(id)) {
            return;
        }

        if (!data.started.includes(id)) {
            data.started.push(id);
        }

        data.completed.push(id);

        saveData(data);

        render();

        alert(
            "🎉 Demo Registration Completed!\n\n" +
            "Your completion status has been saved.\n\n" +
            "Real verification and wallet rewards will be added later."
        );

    }

    /* BUTTON EVENTS */

    document.addEventListener("click", function (event) {

        const button = event.target.closest(
            ".earnova-signup-action"
        );

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === "start") {
            startOffer(id);
        }

        if (action === "complete") {
            completeOffer(id);
        }

    });

    /* INITIALIZE */

    document.addEventListener("DOMContentLoaded", render);

    /* PUBLIC API */

    window.EARNOVA_SIGNUP = {
        offers: signupOffers,
        render: render,
        start: startOffer,
        complete: completeOffer,
        getData: getData
    };

})();