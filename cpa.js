/* ==========================================
   EARNOVA CPA OFFERS SYSTEM 1.0
   Separate CPA Module
========================================== */

"use strict";

(function () {

    const STORAGE_KEY = "earnova_cpa_data";

    const offers = [
        {
            id: "cpa_001",
            title: "Mobile App Discovery",
            description: "Explore a mobile application and discover its features.",
            reward: 25,
            time: "5 Minutes",
            category: "Apps",
            icon: "📱"
        },
        {
            id: "cpa_002",
            title: "Website Exploration",
            description: "Visit a website and explore its content.",
            reward: 10,
            time: "2 Minutes",
            category: "Website",
            icon: "🌐"
        },
        {
            id: "cpa_003",
            title: "Online Registration",
            description: "Complete a registration process on a partner platform.",
            reward: 35,
            time: "5 Minutes",
            category: "Signup",
            icon: "📝"
        },
        {
            id: "cpa_004",
            title: "Video Discovery",
            description: "Watch and explore promotional video content.",
            reward: 15,
            time: "3 Minutes",
            category: "Video",
            icon: "🎬"
        },
        {
            id: "cpa_005",
            title: "Social Activity",
            description: "Explore a social media campaign.",
            reward: 12,
            time: "2 Minutes",
            category: "Social",
            icon: "📲"
        },
        {
            id: "cpa_006",
            title: "Product Research",
            description: "Explore a product and share your feedback.",
            reward: 20,
            time: "4 Minutes",
            category: "Research",
            icon: "🔍"
        },
        {
            id: "cpa_007",
            title: "App Testing",
            description: "Explore and test an application.",
            reward: 30,
            time: "7 Minutes",
            category: "Apps",
            icon: "🧪"
        },
        {
            id: "cpa_008",
            title: "Digital Service",
            description: "Discover a digital service.",
            reward: 18,
            time: "3 Minutes",
            category: "Website",
            icon: "🚀"
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

        let buttonText = "🚀 Start Offer";
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
                    class="earnova-cpa-action"
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

        const section = document.getElementById("offersSection");

        if (!section) return;

        const data = getData();

        const completedCount = offers.filter(
            offer => data.completed.includes(offer.id)
        ).length;

        section.innerHTML = `

            <div class="page-heading">
                <h2>🚀 CPA Offers</h2>
                <p>Explore available earning opportunities</p>
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
                        ${offers.length}
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
                ⚠️ Demo offers only. Real CPA verification
                and payment integration are not connected.
            </div>

            <div id="cpaOfferList">

                ${offers.map(createCard).join("")}

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
            "Offer Started!\n\n" +
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
            "🎉 Demo Offer Completed!\n\n" +
            "Your completion status has been saved.\n\n" +
            "Real reward verification will be connected later."
        );

    }

    /* BUTTON EVENTS */

    document.addEventListener("click", function (event) {

        const button = event.target.closest(
            ".earnova-cpa-action"
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

    window.EARNOVA_CPA = {
        offers: offers,
        render: render,
        start: startOffer,
        complete: completeOffer,
        getData: getData
    };

})();