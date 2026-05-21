const isMobile = () => window.innerWidth <= 768;
const isLongScreen = () => window.innerWidth >= 2560;
const isLongLongScreen = () => window.innerWidth >= 3440;

const categories = [
    'noStops',
    'oneStop',
    'twoStops',
    'moreThanTwoStops'
];

const defaultCategoryColours = [
    '#E14A2C', // noStops - red
    '#9DAEFF', // oneStop - blue
    '#F0D33E', // twoStops - yellow
    '#007E4E'  // moreThanTwoStops - green
];

const rangeKeyByRangeIndex = {
    0: "stops_within_100m",
    1: "stops_within_200m",
    2: "stops_within_300m",
};

const mapLayersConfig = {
    'range-0-100': {
        color: '#3F373B',
        label: '0-100m',
    },
    'range-101-200': {
        color: '#806F77',
        label: '101-200m',
    },
    'range-201-300': {
        color: '#BFA7B3',
        label: '201-300m',
    },
    'townhalls-over-300': {
        color: '#E5C9D7',
        label: 'mehr als 300m',
    }
}

const selectedColour = '#FD6782';

function getScrollRange(scrollY, windowHeight) {
    const scrollStep = scrollY / windowHeight;

    if (scrollStep < 1) return 0; // 0-100m
    if (scrollStep < 2) return 1; // 101-200m
    if (scrollStep < 3) return 2; // 201-300m
    if (scrollStep < 4) return 3; // map-scrollytelling
    if (scrollStep < 5) return 4; // map-scrollytelling-2 (new stage)
    if (scrollStep < 6) return 5; // pre-map-view
}

const scaleRange = (range) => {
    switch (range) {
        case 0:
            return 1;
        case 1:
            return 1.1;
        case 2:
            return 1.2;
        default:
            return 1;
    }
};

export { isMobile, isLongScreen, isLongLongScreen, categories, mapLayersConfig, selectedColour, getScrollRange, scaleRange, defaultCategoryColours, rangeKeyByRangeIndex };