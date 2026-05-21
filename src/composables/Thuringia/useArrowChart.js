import * as d3 from 'd3';
import { isLongScreen, isLongLongScreen, scaleRange, defaultCategoryColours } from '@src/composables/utils.js';

function useArrowChart() {
    function drawArrow(svgEl, stats, currentRange = 0, categoryColours = []) {
        const svg = d3.select(svgEl);

        const width = parseFloat(svgEl.clientWidth);
        const height = parseFloat(svgEl.clientHeight);

        const arrowHeight = height * 0.8;
        const arrowY = (height - arrowHeight) / 2;
        const arrowWidth = width * 0.9;
        const arrowX = (width - arrowWidth) / 2;

        const leftHeadWidth = width * 0.03;
        const rightHeadWidth = width * 0.03;

        const rangeKeys = ['range0_100', 'range101_200', 'range201_300'];
        const rangeStats = stats[rangeKeys[currentRange]] || stats.range0_100;

        const rangeData = [
            rangeStats.townhallsWithNoStops,
            rangeStats.townhallsWithOneStop,
            rangeStats.townhallsWithTwoStops,
            rangeStats.townhallsWithMoreThanTwoStops
        ];

        const total = rangeData.reduce((sum, val) => sum + val, 0);
        let currentX = arrowX;

        const filteredSegments = rangeData
            .map((value, i) => ({
                value,
                color: categoryColours[i]
            }))
            .filter(d => d.value > 0);

        // Calculate total deducted space from arrowheads
        const totalDeducted = leftHeadWidth + rightHeadWidth;
        const availableWidth = arrowWidth - totalDeducted;

        // Calculate proportional widths that fit in available space
        const finalWidths = filteredSegments.map(segment => (segment.value / total) * availableWidth);

        const segments = finalWidths.map((width, i) => {
            const result = {
                ...filteredSegments[i],
                x: currentX,
                width: width
            };
            currentX += width;
            return result;
        });

        svg.selectAll('*').remove();

        svg.selectAll('rect.segment')
            .data(segments)
            .enter()
            .append('rect')
            .attr('class', 'segment')
            .attr('x', d => d.x)
            .attr('y', arrowY)
            .attr('width', d => d.width)
            .attr('height', arrowHeight)
            .attr('fill', d => d.color);

        svg.append('polygon')
            .attr('points', `
        ${arrowX},${arrowY}
        ${arrowX - leftHeadWidth},${arrowY + arrowHeight / 2}
        ${arrowX},${arrowY + arrowHeight}
      `)
            .attr('fill', segments.length > 0 ? segments[0].color : defaultCategoryColours[0]);

        const rightX = currentX;
        svg.append('polygon')
            .attr('points', `
        ${rightX},${arrowY}
        ${rightX + rightHeadWidth},${arrowY + arrowHeight / 2}
        ${rightX},${arrowY + arrowHeight}
      `)
            .attr('fill', segments.length > 0 ? segments[segments.length - 1].color : defaultCategoryColours[defaultCategoryColours.length - 1]);

        const inverseScale = 1 / scaleRange(currentRange);

        const textGroups = svg.selectAll('g.text-group')
            .data(segments)
            .enter()
            .append('g')
            .attr('class', 'text-group')
            .attr('transform', (d, i) => {
                let totalWidth = d.width;
                let startX = d.x;

                if (i === 0) {
                    totalWidth += leftHeadWidth;
                    startX -= leftHeadWidth;
                }

                if (i === segments.length - 1) {
                    totalWidth += rightHeadWidth;
                }

                const centerX = startX + totalWidth / 2;
                const centerY = arrowY + arrowHeight / 2;

                return `translate(${centerX}, ${centerY}) scale(${inverseScale}, 1)`;
            });

        textGroups.append('text')
            .text(d => d.value)
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .attr('font-size', isLongLongScreen() ? '48px' : isLongScreen() ? '32px' : '24px')
            .attr('font-weight', 'bold')
            .style('text-shadow', isLongLongScreen() ? '2px 2px 4px rgba(0,0,0,1)' : '1px 1px 2px rgba(0,0,0,1)')
            .style('pointer-events', 'none');
    }

    return { drawArrow };
}

export { useArrowChart };