
/* ==========================================
   EARNOVA OFFER SYSTEM 3.0
   CPA Offers + Signup Offers
========================================== */

"use strict";

const EARNOVA_OFFER_STORAGE = "earnova_offer_data";

const CPA_OFFERS = [
    {
        id: "cpa1",
        title: "Install & Explore App",
        description: "Install a mobile application and explore its features.",
        reward: 25,
        time: "5 minutes",
        category: "Apps",
        icon: "📱"
    },
    {
        id: "cpa2",
        title: "Visit Partner Website",
        description: "Visit a partner website and explore the available content.",
        reward: 10,
        time: "2 minutes",
        category: "Website",
        icon: "🌐"
    },
    {
        id: "cpa3",
        title: "Complete Registration",
        description: "Register with a partner platform.",
        reward: 35,
        time: "5 minutes",
        category: "Signup",
        icon: "📝"
    },
    {
        id: "cpa4",
        title: "Watch Promotional Video",
        description: "Watch a promotional video.",
        reward: 15,
        time: "3 minutes",
        category: "Video",
        icon: "🎬"
    },
    {
        id: "cpa5",
        title: "Social Media Activity",
        description: "Complete a social media activity.",
        reward: 12,
        time: "2 minutes",
        category: "Social",
        icon: "📲"
    },
    {
        id: "cpa6",
        title: "Product Research",
        description: "Explore a product and answer simple questions.",
        reward: 20,
        time: "4 minutes",
        category: "Survey",
        icon: "🔍"
    },
    {
        id: "cpa7",
        title: "Download & Test",
        description: "Download and test an application.",
        reward: 30,
        time: "7 minutes",
        category: "Apps",
        icon: "🧪"
    },
    {
        id: "cpa8",
        title: "Online Discovery",
        description: "Discover a new online service.",
        reward: 18,
        time: "3 minutes",
        category: "Website",
        icon: "🚀"
    }
];

const SIGNUP_OFFERS = [
    {
        id: "signup1",
        title: "Create an Account",
        description: "Create a new account on a participating platform.",
        reward: 20,
        time: "3 minutes",
        category: "Registration",
        icon: "👤"
    },
    {
        id: "signup2",
        title: "Email Registration",
        description: "Complete an email-based registration.",
        reward: 15,
        time: "2 minutes",
        category: "Email",
        icon: "📧"
    },
    {
        id: "signup3",
        title: "Community Registration",
        description: "Register for an online community.",
        reward: 25,
        time: "4 minutes",
        category: "Community",
        icon: "👥"
    },
    {
        id: "signup4",
        title: "Learning Platform",
        description: "Create an account on a learning platform.",
        reward: 30,
        time: "5 minutes",
        category: "Education",
        icon: "🎓"
    },
    {
        id: "signup5",
        title: "Newsletter Signup",
        description: "Register for a newsletter.",
        reward: 10,
        time: "1 minute",
        category: "Newsletter",
        icon: "📰"
    },
    {
        id: "signup6",
        title: "Service Registration",
        description: "Create a profile on an online service.",
        reward: 35,
        time: "5 minutes",
        category: "Service",
        icon: "💼"
    }
];

/* STORAGE */

function getOfferData() {
    try {
        return JSON.parse(
            localStorage.getItem(EARNOVA_OFFER_STORAGE)
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

function saveOfferData(data) {
    localStorage.setItem(
        EARNOVA_OFFER_STORAGE,
        JSON.stringify(data)
    );
}

/* OFFER STATUS */

function getOfferStatus(id) {
    const data = getOfferData();

    if (data.completed.includes(id)) {
        return "completed";
    }

    if (data.started.includes(id)) {
        return "started";
    }

    return "available";
}

/* START OFFER */

function startEarnovaOffer(id) {
    const data = getOfferData();

    if (data.completed.includes(id)) {
        alert("You have already completed this offer!");
        return;
    }

    if (!data.started.includes(id)) {
        data.started.push(id);
        saveOfferData(data);
    }

    renderEarnovaOffers();

    alert(
        "Offer started successfully!\n\n" +
        "Complete the offer and return to EARNOVA."
    );
}

/* COMPLETE DEMO OFFER */

function completeEarnovaOffer(id) {
    const data = getOfferData();

    if (data.completed.includes(id)) {
        alert("This offer is already completed!");
        return;
    }

    if (!data.started.includes(id)) {
        data.started.push(id);
    }

    data.completed.push(id);

    saveOfferData(data);

    renderEarnovaOffers();

    alert(
        "Demo offer completed!\n\n" +
        "Reward is currently simulated.\n" +
        "Real verification and wallet integration will be added later."
    );
}

/* OFFER CARD */

function createEarnovaOfferCard(offer, type) {
    const status = getOfferStatus(offer.id);

    let buttonText = "🚀 Start Offer";
    let buttonAction = "start";

    if (status === "started") {
        buttonText = "✅ Complete Demo";
        buttonAction = "complete";
    }

    if (status === "completed") {
        buttonText = "✔ Completed";
        buttonAction = "completed";
    }

    return `
        <div class="offer-card"
             style="
                background:#111b17;
                border:1px solid #23382e;
                border-radius:16px;
                padding:18px;
                margin-bottom:14px;
             ">

            <div style="
                display:flex;
                align-items:center;
                gap:12px;
                margin-bottom:12px;
            ">

                <div style="
                    font-size:32px;
                    width:48px;
                    height:48px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#1b3025;
                    border-radius:12px;
                ">
                    ${offer.icon}
                </div>

                <div style="flex:1">
                    <h3 style="margin:0;color:#ffffff">
                        ${offer.title}
                    </h3>

                    <small style="color:#9aafa2">
                        ${offer.category}
                    </small>
                </div>

            </div>

            <p style="
                color:#a9b8ae;
                font-size:13px;
                line-height:1.6;
            ">
                ${offer.description}
            </p>

            <div style="
                display:flex;
                justify-content:space-between;
                margin:15px 0;
                font-size:13px;
            ">

                <span style="color:#9aafa2">
                    ⏱ ${offer.time}
                </span>

                <strong style="color:#39e68a">
                    +${offer.reward} Coins
                </strong>

            </div>

            <button
                class="earnova-offer-button"
                data-offer-id="${offer.id}"
                data-offer-action="${buttonAction}"
                data-offer-type="${type}"
                ${buttonAction === "completed" ? "disabled" : ""}
                style="
                    width:100%;
                    padding:12px;
                    border:none;
                    border-radius:10px;
                    background:${buttonAction === "completed"
                        ? "#26352d"
                        : "#18a85b"};
                    color:white;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                ${buttonText}
            </button>

        </div>
    `;
}

/* RENDER CPA OFFERS */

function renderEarnovaCPA() {
    const section = document.getElementById("offersSection");

    if (!section) return;

    const data = getOfferData();

    section.innerHTML = `
        <div class="page-heading">
            <h2>🚀 CPA Offers</h2>
            <p>Explore available earning opportunities</p>
        </div>

        <div style="
            display:flex;
            gap:10px;
            margin-bottom:18px;
            flex-wrap:wrap;
        ">
            <div style="
                background:#13251b;
                padding:12px;
                border-radius:12px;
                flex:1;
                text-align:center;
            ">
                <small style="color:#9aafa2">Available</small>
                <h3 style="color:#39e68a;margin:5px 0">
                    ${CPA_OFFERS.length}
                </h3>
            </div>

            <div style="
                background:#13251b;
                padding:12px;
                border-radius:12px;
                flex:1;
                text-align:center;
            ">
                <small style="color:#9aafa2">Completed</small>
                <h3 style="color:#39e68a;margin:5px 0">
                    ${CPA_OFFERS.filter(o =>
                        data.completed.includes(o.id)
                    ).length}
                </h3>
            </div>
        </div>

        <div id="earnovaCPAList">
            ${CPA_OFFERS.map(offer =>
                createEarnovaOfferCard(offer, "cpa")
            ).join("")}
        </div>
    `;
}

/* RENDER SIGNUP OFFERS */

function renderEarnovaSignup() {
    const section = document.getElementById("signupSection");

    if (!section) return;

    const data = getOfferData();

    section.innerHTML = `
        <div class="page-heading">
            <h2>📝 Signup Offers</h2>
            <p>Discover registration opportunities</p>
        </div>

        <div style="
            display:flex;
            gap:10px;
            margin-bottom:18px;
        ">
            <div style="
                background:#13251b;
                padding:12px;
                border-radius:12px;
                flex:1;
                text-align:center;
            ">
                <small style="color:#9aafa2">Available</small>
                <h3 style="color:#39e68a;margin:5px 0">
                    ${SIGNUP_OFFERS.length}
                </h3>
            </div>

            <div style="
                background:#13251b;
                padding:12px;
                border-radius:12px;
                flex:1;
                text-align:center;
            ">
                <small style="color:#9aafa2">Completed</small>
                <h3 style="color:#39e68a;margin:5px 0">
                    ${SIGNUP_OFFERS.filter(o =>
                        data.completed.includes(o.id)
                    ).length}
                </h3>
            </div>
        </div>

        <div id="earnovaSignupList">
            ${SIGNUP_OFFERS.map(offer =>
                createEarnovaOfferCard(offer, "signup")
            ).join("")}
        </div>
    `;
}

/* RENDER ALL */

function renderEarnovaOffers() {
    renderEarnovaCPA();
    renderEarnovaSignup();
}

/* BUTTON EVENTS */

document.addEventListener("click", function(event) {
    const button = event.target.closest(
        ".earnova-offer-button"
    );

    if (!button) return;

    const id = button.dataset.offerId;
    const action = button.dataset.offerAction;

    if (action === "start") {
        startEarnovaOffer(id);
    }

    if (action === "complete") {
        completeEarnovaOffer(id);
    }
});

/* INITIALIZE */

document.addEventListener("DOMContentLoaded", function() {
    renderEarnovaOffers();
});

/* PUBLIC API */

window.EARNOVA_OFFERS = {
    CPA: CPA_OFFERS,
    SIGNUP: SIGNUP_OFFERS,
    render: renderEarnovaOffers,
    start: startEarnovaOffer,
    complete: completeEarnovaOffer,
    getData: getOfferData
};

