import * as d3 from 'd3'

function toPercent(value, total) {
    if (total === 0) return '0';
    return Math.round((value / total) * 100);
}

function computeStats(rawData) {
    const stats = {
        range0_100: {
            townhallsWithNoStops: rawData.filter(d => d.stops100m === 0).length,
            townhallsWithOneStop: rawData.filter(d => d.stops100m === 1).length,
            townhallsWithTwoStops: rawData.filter(d => d.stops100m === 2).length,
            townhallsWithMoreThanTwoStops: rawData.filter(d => d.stops100m > 2).length,
            totalStops: d3.sum(rawData, d => d.stops100m)
        },
        range101_200: {
            townhallsWithNoStops: rawData.filter(d => d.stops200m === 0).length,
            townhallsWithOneStop: rawData.filter(d => d.stops200m === 1).length,
            townhallsWithTwoStops: rawData.filter(d => d.stops200m === 2).length,
            townhallsWithMoreThanTwoStops: rawData.filter(d => d.stops200m > 2).length,
            totalStops: d3.sum(rawData, d => d.stops200m - d.stops100m)
        },
        range201_300: {
            townhallsWithNoStops: rawData.filter(d => d.stops300m === 0).length,
            townhallsWithOneStop: rawData.filter(d => d.stops300m === 1).length,
            townhallsWithTwoStops: rawData.filter(d => d.stops300m === 2).length,
            townhallsWithMoreThanTwoStops: rawData.filter(d => d.stops300m > 2).length,
            totalStops: d3.sum(rawData, d => d.stops300m - d.stops200m)
        },
        stops_within_300m: rawData.filter(d => d.stops300m > 0),
        townhallsWithoutStopsWithin300m: rawData.filter(d => d.stops300m === 0)
    };

    const totalTownhalls = rawData.length;
    const statsPercentages = {
        range0_100: {
            noStopsPercent: toPercent(stats.range0_100.townhallsWithNoStops, totalTownhalls),
            stopsInRangePercent: toPercent(stats.range0_100.townhallsWithOneStop + stats.range0_100.townhallsWithTwoStops + stats.range0_100.townhallsWithMoreThanTwoStops, totalTownhalls)
        },
        range101_200: {
            noStopsPercent: toPercent(stats.range101_200.townhallsWithNoStops, totalTownhalls),
            stopsInRangePercent: toPercent(stats.range101_200.townhallsWithOneStop + stats.range101_200.townhallsWithTwoStops + stats.range101_200.townhallsWithMoreThanTwoStops, totalTownhalls)
        },
        range201_300: {
            noStopsPercent: toPercent(stats.range201_300.townhallsWithNoStops, totalTownhalls),
            stopsInRangePercent: toPercent(stats.range201_300.townhallsWithOneStop + stats.range201_300.townhallsWithTwoStops + stats.range201_300.townhallsWithMoreThanTwoStops, totalTownhalls)
        }
    };

    return { stats, statsPercentages };
}

export { computeStats };