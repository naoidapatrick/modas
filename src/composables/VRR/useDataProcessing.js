import * as d3 from 'd3'

function loadData(rawData) {
    const allData = Array.isArray(rawData) ? rawData : [];

    const getCategory = (d) => d.category ?? d.Category ?? '';
    const getChartNumber = (d) => {
        const val = d.chart_number ?? d['Chart Number'] ?? d['chart number'] ?? 0;
        return +val || 0;
    };

    const firstChartCategories = [...new Set(allData.filter(d => getChartNumber(d) === 1).map(d => getCategory(d)).filter(Boolean))];
    const secondChartCategories = [...new Set(allData.filter(d => getChartNumber(d) === 2).map(d => getCategory(d)).filter(Boolean))];

    const statsByCat = {};
    firstChartCategories.forEach(cat => {
        const rows = allData.filter(d => getCategory(d) === cat);
        statsByCat[cat] = {
            total2022: d3.sum(rows, d => +d['2022'] || 0),
            total2023: d3.sum(rows, d => +d['2023'] || 0),
            total2024: d3.sum(rows, d => +d['2024'] || 0),
        };
    });

    const secondChartData = allData.filter(d => getChartNumber(d) === 2).flatMap(d => [
        { year: 2022, category: getCategory(d), value: +d['2022'] || 0 },
        { year: 2023, category: getCategory(d), value: +d['2023'] || 0 },
        { year: 2024, category: getCategory(d), value: +d['2024'] || 0 },
    ]);

    const pieData = allData.filter(d => getChartNumber(d) === 3).map(d => ({
        Percentage: +d.percentage ?? +d.Percentage ?? 0,
        Category: getCategory(d)
    }));

    const stats = {
        statsByCat,
        totalRecords: {
            total2022: d3.sum(Object.values(statsByCat), d => d.total2022),
            total2023: d3.sum(Object.values(statsByCat), d => d.total2023),
            total2024: d3.sum(Object.values(statsByCat), d => d.total2024),
        }
    };

    const categoryNames = {};
    allData.forEach(d => {
        const cat = getCategory(d);
        if (cat && !categoryNames[cat]) categoryNames[cat] = cat;
    });

    return { statsByCat, secondChartData, pieData, stats, firstChartCategories, secondChartCategories, categoryNames };
}

export { loadData };
