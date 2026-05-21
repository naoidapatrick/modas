<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { loadData } from '@composables/VRR/useDataProcessing';

import ArrowBubbleChart from './ArrowBubbleChart.vue';
import Timeline from './Timeline.vue';
import PieChart from './PieChart.vue';
import HorizontalScrollChart from './HorizontalScrollChart.vue';
import SectionHeading from './SectionHeading.vue';
import PhaseCard from './PhaseCard.vue';
import ColouredSection from './ColouredSection.vue';
import SideMenu from '@src/components/SideMenu.vue';
import EditableTextField from '@src/components/EditableTextField.vue';

import robotHandsUp from '@img/VRR/Robot/HandsUp.svg';
import paul from '@img/VRR/Characters/Paul.svg';
import robotHandsDown from '@img/VRR/Robot/HandsDown.svg';

const props = defineProps({
    data: { type: Array, default: () => [] },
    mode: { type: String, default: 'view' },
    columnLabelMap: { type: Object, default: () => ({}) },
    categoryColours: { type: Object, default: () => ({}) },
});

const chartData = ref(null)
const activeMode = ref('view');
const isPresenting = ref(false);

const headers = ref({
    section1: 'Anfragen über die verschiedenen Kanäle',
    section2: 'Steigende Erwartungen an digitale Erreichbarkeit',
    section3: 'Oktober 2022 bis September 2024 – Testlauf Service-Chat',
    section4: 'Phasenverlauf des Versuchs',
    section5: 'Service-Chat – Phase 1: Personenbedienter Chat',
    section6: 'Service-Chat – Phase 2: Q&A-Chatbot',
    section7: 'Versuch Service-Chat – Zwischenergebnis',
    section8: 'Ergebnis Service-Chat – Erfolgsroboter',
    section9: 'Mehrwert ohne Verdrängung'
});

const textFields = ref({
    first: 'Service-Chat',
    second: 'Digitale Transformation im Kundenservice',
    third: '"Wie können wir Fahrgastanfragen schnell, effizient und rund um die Uhr bearbeiten?"',
    forth: 'Laufzeit: Oktober 2022 bis September 2024\nZiel: Test eines digitalen, automatisierten Kundenkanals; Erkenntnisgewinnung hinsichtlich Kundenakzeptanz und Möglichkeiten der Substitution klassischer Dialogkanäle\nTechnologie: KI-gestützter Chatbot\nZielgruppe: Fahrgäste mit Serviceanfragen',
    fifth: 'Start: Go-Live am 04.10. \nReaktive Anzeige des Chatbuttons\nNutzerbewertung: Abfrage der Zufriedenheit der Nutzer / subjektive Auskunftsqualität in Form einer Sternebewertung',
    sixth: 'Hallo Mensch!\nIch bin ein Chatbot. Du kannst mich alles fragen!',
    seventh: 'Q&A Chatbot\n\nAufbau Q&A Chatbot: Modellierung sog. "Flows" (Abläufe) für verschiedene Themenbereiche, in Zukunft KI-gestützt.\nAntwortgenerierung: Ausspielung von bis zu fünf verschiedenen Wissensartikeln, auch als Verlinkung\nIdentifizierung von geeigneten Themen für das (priorisierte) Beauskunften durch Chatbot',
});

const phases = ref({
    phase1: {
        title: 'Phase 1',
        description: 'Personenbedienter Chat',
        characterImage: paul,
        characterAlt: 'Paul',
        phaseClass: 'phase1'
    },
    phase2: {
        title: 'Phase 2',
        description: 'Q&A-Chatbot, KI unterstützt',
        characterImage: robotHandsDown,
        characterAlt: 'Robot Hands Down',
        phaseClass: 'phase2'
    }
});

const selectedPieSlice = ref(null);

const handlePieSliceSelected = (sliceData) => {
    selectedPieSlice.value = sliceData;
};

const characterImage = computed(() => {
    if (!selectedPieSlice.value) return robotHandsUp; // image before pressing on category
    if (selectedPieSlice.value.index === 0) return robotHandsUp;
    if (selectedPieSlice.value.index === 1) return paul;
});

const characterMessage = computed(() => {
    if (!selectedPieSlice.value) return 'Ich konnte rund 70% aller Anfragen selbst lösen!';

    // Change message based on selected slice
    if (selectedPieSlice.value.index === 0) {
        return `Ich konnte rund ${selectedPieSlice.value.percentage}% aller Anfragen selbst lösen!`;
    }
    if (selectedPieSlice.value.index === 1) {
        return `In ${selectedPieSlice.value.percentage}% haben wir vom Servicepersonal geholfen!`;
    }
});

const handleModeChange = (newMode) => {
    if (newMode === "presenter") {
        activeMode.value = "view";
        const storyContainer = document.querySelector('.vrr-app');
        if (storyContainer?.requestFullscreen) {
            storyContainer.requestFullscreen();
            isPresenting.value = true;
        }
    } else {
        activeMode.value = newMode;
    }
};

const exitPresenter = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    isPresenting.value = false;
    activeMode.value = "view";
};

watch(() => props.data, (newData) => {
    if (!newData || newData.length === 0) return;
    chartData.value = loadData(newData);
}, { immediate: true });

onMounted(async () => {
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            isPresenting.value = false;
        }
    })
});

onUnmounted(() => {
    document.removeEventListener("fullscreenchange", () => { });
});
</script>

<template>
    <div class="vrr-app">
        <SideMenu v-if="!isPresenting" :active-mode="activeMode" :default-gradient="{
            angle: 180,
            stops: [{ color: '#ffffff', position: 0 }, { color: '#e1ffd6', position: 50 }, { color: '#d6f5ff', position: 100 }]
        }" @mode-change="handleModeChange" />
        <button v-if="isPresenting" class="exit-presenter" @click="exitPresenter">Präsentationsansicht beenden</button>
        <header>
            <div>
                <EditableTextField :model-value="textFields.first" @update:model-value="val => textFields.first = val"
                    :active-mode="activeMode" :rows="1" :width="'100%'" :font-size="'32px'" :line-height="1"
                    :padding="'0vh'" :font-weight="'normal'" />
                <EditableTextField :model-value="textFields.second" @update:model-value="val => textFields.second = val"
                    :active-mode="activeMode" :rows="1" :width="'100%'" :font-size="'32px'" :line-height="1"
                    :padding="'0vh'" :font-weight="'bold'" />
            </div>
        </header>
        <main>
            <!-- Part 1 -->
            <div class="chat-img">
                <img id="openai-chat" src="@img/VRR/OpenAI-Chat.svg" alt="OpenAI Chat" />
                <img id="vrr-chat" src="@img/VRR/VRR-Chat.svg" alt="VRR Chat" />
            </div>

            <div class="tp-img"> <!-- tp -> transport & people -->
                <img id="red-tram" src="@img/VRR/Transport/TramRed.svg" alt="Red Tram" />
                <img id="people" src="@img/VRR/Characters/People.svg" alt="People" />
                <img id="red-bus" src="@img/VRR/Transport/BusRed.svg" alt="Red Bus" />
            </div>
            <!-- ----------------------------------------------------- -->

            <!-- Part 2 -->
            <SectionHeading v-model="headers.section1" :active-mode="activeMode" />

            <div class="chart-overlay">
                <ArrowBubbleChart :first-chart-data="chartData?.stats" :chart-number="1" :active-mode="activeMode"
                    :height="'40vh'" :bubble-position="[28, 51, 75]" :timeline-start="25" :percentage-shift="23"
                    :bubble-gap="1" :margin-top="`5%`" :category-names="chartData?.categoryNames"
                    :category-colours="props.categoryColours?.[1]" />
            </div>

            <div class="bg-img">
                <img id="orange-tram" src="@img/VRR/Transport/TramOrange.svg" alt="Orange Tram" />
                <img id="ava" src="@img/VRR/Characters/Ava.svg" alt="Ava" />
            </div>
            <!-- ----------------------------------------------------- -->

            <!-- Part 3 -->
            <SectionHeading v-model="headers.section2" :active-mode="activeMode" />

            <ColouredSection>
                <template #background>
                    <div class="characters">
                        <img id="theo" src="@img/VRR/Characters/Theo.svg" alt="Theo" />
                        <img id="ava" src="@img/VRR/Characters/Ava.svg" alt="Ava" />
                    </div>
                    <div class="tram-bus">
                        <img id="orange-tram-second" src="@img/VRR/Transport/TramOrange.svg" alt="Orange Tram" />
                        <img id="green-bus" src="@img/VRR/Transport/BusGreen.svg" alt="Green Bus" />
                    </div>
                    <img id="theresa" src="@img/VRR/Characters/Theresa.svg" alt="Theresa">
                </template>

                <img id="paul" src="@img/VRR/Characters/Paul.svg" alt="Paul">
                <EditableTextField :model-value="textFields.third" @update:model-value="val => textFields.third = val"
                    :active-mode="activeMode" :rows="6" :width="'100%'" :font-size="'32px'" :line-height="1.6"
                    :padding="'0'" />
            </ColouredSection>
            <!-- ----------------------------------------------------- -->

            <!-- Part 4 -->
            <SectionHeading v-model="headers.section3" :active-mode="activeMode" />

            <ColouredSection>
                <template #background>
                    <div class="testlauf-bg-img">
                        <div class="bus-crosswalk">
                            <img id="green-bus" src="@img/VRR/Transport/BusGreen.svg" alt="Green Bus" />
                            <img id="crosswalk" src="@img/VRR/Characters/Crosswalk.svg" alt="People on a crosswalk">
                        </div>
                        <img id="orange-tram" src="@img/VRR/Transport/TramOrange.svg" alt="Orange Tram">
                    </div>
                </template>

                <EditableTextField :model-value="textFields.forth" @update:model-value="val => textFields.forth = val"
                    :active-mode="activeMode" :rows="7" :width="'100%'" :font-size="'24px'" :line-height="2"
                    :padding="'0'" />
            </ColouredSection>
            <!-- ----------------------------------------------------- -->

            <!-- Part 5 -->
            <SectionHeading v-model="headers.section4" :active-mode="activeMode" />

            <div class="section-wrapper">
                <div class="characters-tram">
                    <img id="theo" src="@img/VRR/Characters/Theo.svg" alt="Theo" />
                    <img id="orange-tram" src="@img/VRR/Transport/TramOrange.svg" alt="Orange Tram" />
                    <img id="ava" src="@img/VRR/Characters/Ava.svg" alt="Ava" />
                </div>
                <img id="theresa-phases" src="@img/VRR/Characters/Theresa.svg" alt="Theresa">

                <div class="phase-cards">
                    <PhaseCard :active-mode="activeMode" @update:phaseTitle="val => phases.phase1.title = val"
                        @update:phaseDescription="val => phases.phase1.description = val"
                        :phase-title="phases.phase1.title" :phase-description="phases.phase1.description"
                        :character-image="phases.phase1.characterImage" :character-alt="phases.phase1.characterAlt"
                        :phase-class="phases.phase1.phaseClass" />
                    <PhaseCard :active-mode="activeMode" @update:phaseTitle="val => phases.phase2.title = val"
                        @update:phaseDescription="val => phases.phase2.description = val"
                        :phase-title="phases.phase2.title" :phase-description="phases.phase2.description"
                        :character-image="phases.phase2.characterImage" :character-alt="phases.phase2.characterAlt"
                        :phase-class="phases.phase2.phaseClass" />
                    <Timeline />
                </div>
            </div>
            <!-- ----------------------------------------------------- -->

            <!-- Part 6 -->
            <SectionHeading v-model="headers.section5" :active-mode="activeMode" />

            <ColouredSection>
                <EditableTextField :model-value="textFields.fifth" @update:model-value="val => textFields.fifth = val"
                    :active-mode="activeMode" :rows="7" :width="'100%'" :font-size="'24px'" :line-height="2"
                    :padding="'0'" />

                <template #extra>
                    <img id="paul-big" src="@img/VRR/Characters/Paul.svg" alt="Paul">
                </template>
            </ColouredSection>
            <!-- ----------------------------------------------------- -->

            <!-- Part 7 -->
            <SectionHeading v-model="headers.section6" :active-mode="activeMode" />
            <div class="whole-robot-section">
                <img id="robot-cheering" src="@img/VRR/Robot/HandsUpCheering.svg" alt="Robot with hands up cheering">
                <div class="robot-chatbot-section">
                    <div class="message">
                        <EditableTextField :model-value="textFields.sixth"
                            @update:model-value="val => textFields.sixth = val" :active-mode="activeMode" :rows="4"
                            :width="'100%'" :font-size="'32px'" :line-height="1.2" :text-align="'center'"
                            :font-weight="'normal'" :padding="'3vh'" />
                    </div>
                    <div class="section-wrapper">
                        <ColouredSection wrapper-class="robot-chatbot-wrapper" coloured-class="robot-coloured"
                            white-space-class="robot-white">
                            <EditableTextField :model-value="textFields.seventh"
                                @update:model-value="val => textFields.seventh = val" :active-mode="activeMode"
                                :rows="8" :width="'100%'" :font-size="'26px'" :line-height="2" :padding="'3vh'" />
                        </ColouredSection>
                    </div>
                </div>
            </div>
            <!-- ----------------------------------------------------- -->

            <!-- Part 8 -->
            <SectionHeading v-model="headers.section7" :active-mode="activeMode" />
            <div class="character-chart">
                <img id="character-change" :src="characterImage" alt="Character">
                <PieChart :data="chartData?.pieData" :active-mode="activeMode"
                    @pie-slice-selected="handlePieSliceSelected" :category-colours="props.categoryColours?.[3]"
                    :category-names="chartData?.categoryNames" />
                <div class="message-character">
                    <EditableTextField :model-value="characterMessage" :active-mode="activeMode" :rows="2"
                        :width="'100%'" :font-size="'16px'" :line-height="1.4" :text-align="'center'"
                        :font-weight="'normal'" :padding="'2vh'" />
                </div>
            </div>
            <!-- ----------------------------------------------------- -->

            <!-- Part 9 -->
            <SectionHeading v-model="headers.section8" :active-mode="activeMode" />

            <div class="robot-form">
                <div class="stars-robot">
                    <img id="stars" src="@img/VRR/Stars.svg" alt="Stars">
                    <img id="robot-hands-up-cheering" src="@img/VRR/Robot/HandsUpCheering.svg"
                        alt="Cheering robot with hands up">
                </div>
                <ColouredSection wrapper-class="robot-form-wrapper" coloured-class="robot-form-coloured"
                    white-space-class="robot-form-white">
                    <div class="intro">
                        <h1>Bewertung:</h1>
                        <h1><span>Durchschnittlich</span> 4 von 5 Sternen</h1>
                    </div>
                    <div class="form">
                        <h1>Gesprächsbewertung</h1>
                        <h1><span>Vielen Dank für das Gespräch. Konnten wir Ihnen behilflich sein?</span></h1>
                        <img src="@img/VRR/StarsForm.svg" alt="Stars for rating">
                        <div class="submit-button">
                            <h1>BEWERTUNG SENDEN</h1>
                        </div>
                    </div>
                    <div class="tooltip">
                        <p>Nutzerbewertung erfolgte über eine Abfrage der <span>Zufriedenheit</span> der
                            Nutzer*innen / <span>subjektive Auskunftsqualität</span> in Form einer
                            <span>Sternebewertung</span>
                        </p>
                    </div>
                </ColouredSection>
            </div>
            <!-- ----------------------------------------------------- -->

            <!-- Part 10 -->
            <SectionHeading v-model="headers.section9" :active-mode="activeMode" />
            <HorizontalScrollChart :second-chart-data="chartData?.secondChartData" :chart-number="2"
                :active-mode="activeMode" :year-shift="1" :wrapper-height="'300vh'" :scroll-sensitivity="0.2"
                :category-names="chartData?.categoryNames" :category-colours="props.categoryColours?.[2]" />
            <!-- ----------------------------------------------------- -->
        </main>
    </div>
</template>

<style scoped>
.vrr-app {
    height: 100vh;
    width: 100%;
    overflow-x: hidden;
}

header {
    width: 100%;
    height: 15vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 2% 0 2% 5%;
    color: #760B5A;
    gap: 2rem;
}

header div {
    width: 80%;
}

header img {
    width: 6%;
}

h1 span {
    font-weight: 400;
}

main {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.chat-img {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2%;
    height: 45vh;
}

#openai-chat {
    width: 60%;
}

#vrr-chat {
    width: 25%;
}

.tp-img {
    width: 100%;
    position: relative;
    display: flex;
    align-items: end;
    justify-content: center;
    overflow: hidden;
    height: 25vh;
    margin-bottom: 3%;
}

#red-tram {
    height: 100%;
    width: auto;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translateX(-70%);
}

#people {
    height: 50%;
    position: absolute;
    z-index: 2;
}

#red-bus {
    height: 100%;
    width: auto;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateX(60%);
}

#orange-tram {
    position: relative;
    height: 25vh;
    transform: translateX(90%);
    opacity: 0.08;
    z-index: 1;
    margin-top: -15vh;
    margin-bottom: 15px;
}

.tram-bus {
    position: relative;
    width: 100%;
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 40%;
    margin-top: -35vh;
    height: 25vh;
}

#orange-tram-second,
#green-bus {
    height: 100%;
    z-index: 0;
}

#orange-tram-second {
    opacity: 0.12;
}

#green-bus {
    opacity: 0.2;
}

.chart-overlay {
    position: relative;
    width: 100%;
    z-index: 3;
    pointer-events: none;
    margin-bottom: 5%;
}

.characters {
    margin-bottom: 20%;
}

.characters,
.characters-tram,
.bg-img {
    position: relative;
    width: 100%;
    align-items: end;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.bg-img {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10%;
}

.bg-img #orange-tram {
    transform: none;
}

.characters-tram {
    align-items: flex-start;
}

.characters-tram #orange-tram {
    margin: -5% -5% 0 0;
    transform: none;
}

.characters-tram #theo,
.characters-tram #ava {
    opacity: 0.13;
}

#theo,
#ava {
    height: 30vh;
    opacity: 0.4;
}

#orange-tram,
#theo,
#ava,
#theresa,
#theresa-phases {
    z-index: 1;
}

#theresa,
#theresa-phases {
    height: 50vh;
    position: relative;
    margin-top: 5%;
    opacity: 0.4;
}

#theresa-phases {
    opacity: 0.13;
    margin-top: 0;
}

.section-wrapper {
    position: relative;
    width: 100%;
    height: 80vh;
}

.section-wrapper .characters {
    margin-bottom: 0;
}

#paul {
    width: 50%;
}

.testlauf-bg-img {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-left: -2%;
}

.bus-crosswalk {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 50%;
}

#crosswalk {
    width: 40%;
    margin-left: 15%;
    opacity: 0.4;
}

.testlauf-bg-img #orange-tram {
    opacity: 0.23;
    height: 35vh;
    transform: translateY(50%);
    margin: 0 0 0 20%;
}

.phase-cards {
    height: 50vh;
    z-index: 4;
    position: absolute;
    width: 100%;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
}

#paul-big {
    position: absolute;
    left: -5%;
    bottom: 0;
    z-index: 2;
}

.whole-robot-section {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 0;
}

#robot-cheering {
    position: sticky;
    top: 20%;
    width: 30%;
    margin-left: 10%;
}

.robot-chatbot-section {
    position: relative;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 11;
    margin-top: 25%;
    margin-left: auto;
    margin-right: 5%;
}

.message {
    position: relative;
    width: 50%;
    background-color: white;
    padding: 2rem 3rem;
    border-radius: 0 150px 230px 190px;
}

.character-chart {
    height: 70vh;
    width: 100%;
    position: relative;
}

#character-change {
    position: absolute;
    right: 55%;
    bottom: 0;
    height: 70%;
    max-width: 35%;
}

.character-chart>*:nth-child(2) {
    position: absolute;
    right: 10%;
    bottom: 0;
    height: 100%;
    width: 40%;
}

.message-character::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 5%;
    border-left: 30px solid transparent;
    border-bottom: 20px solid white;
    transform: skew(70deg);
}

.message-character {
    position: absolute;
    width: 15%;
    left: 37%;
    bottom: 5%;
    background-color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 450px 400px 600px 800px;
    text-align: center;
}

.message-character h1 {
    font-weight: 400;
    font-size: 20px;
    text-wrap: wrap;
}

.robot-form {
    width: 100%;
    height: 60vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 16px 48px 16px 0;
    margin: 32px 0;
}

.robot-form .form {
    height: fit-content;
    gap: 0;
}

.stars-robot {
    width: 40%;
    height: 100%;
    position: relative;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#robot-hands-up-cheering {
    height: 80%;
    width: fit-content;
    transform: rotate(-10deg);
}

#stars {
    position: absolute;
    top: 0%;
    width: 50%;
    z-index: 2;
    margin-left: -24px;
}

.robot-form .white-space h1 {
    width: 100%;
    line-height: 1.3;
    font-family: 'General Sans';
    font-size: 24px;
    letter-spacing: normal;
    text-transform: none;
    -webkit-text-stroke: 0px;
    text-shadow: none;
    color: black;
    font-weight: 700;
}

.intro {
    display: flex;
    flex-direction: column;
}

.intro h1 {
    text-align: left;
    margin: 0;
}

.form::before {
    content: "\00d7";
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.5rem;
    color: #BBBBBB;
}

.form {
    position: relative;
    width: 90%;
    height: 60%;
    background-color: white;
    border-radius: 10px;
    border-color: #BBBBBB;
    border-width: 1.2px;
    border-style: solid;
    padding: 1rem 1.5rem;
    transform: rotate(-5deg);
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
}

.form h1 {
    margin: 0;
}

.form span {
    color: #666666;
    font-size: 1.8rem;
}

.form img {
    width: 70%;
    margin: 2% 0;
}

.submit-button {
    width: 100%;
    background-color: #A6127E;
    border-radius: 5px;
    text-align: center;
    color: white;
}

.submit-button h1 {
    margin: 0.5rem 0;
    font-size: 1.2rem;
    font-weight: 500;
}

.tooltip::before {
    content: "\2139";
    font-size: 1.5rem;
    color: white;
    background-color: #760B5A;
    border-radius: 50%;
    padding: 1.5px 10px;
    text-align: center;
}

.tooltip {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: 0;
    z-index: 5;
    cursor: pointer;
}

.tooltip p {
    visibility: hidden;
    min-width: 250px;
    background-color: white;
    color: #000;
    text-align: left;
    border-radius: 6px;
    padding: 5px 10px;
    position: absolute;
    z-index: 50;
    bottom: 100%;
    right: 0;
    text-wrap: wrap;
    border: 1.5px solid #BBB;
}

.tooltip p span {
    font-weight: 600;
}

.tooltip:hover p {
    visibility: visible;
}

.exit-presenter {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #010080;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.40);
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.vrr-app:fullscreen::backdrop {
    background-image: linear-gradient(rgba(255, 255, 255, 1), rgba(225, 255, 214, 1), rgba(214, 245, 255, 1)) !important;
}

.vrr-app:fullscreen {
    background: transparent !important;
}

.vrr-app:-webkit-full-screen,
.vrr-app:-moz-full-screen,
.vrr-app:-ms-fullscreen {
    background: transparent !important;
}
</style>