import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import 'cal-heatmap/cal-heatmap.css';

import json from 'data/2024.json';

const result: any[] = [];
for (const outerKey in json) {
  for (const innerKey in json[outerKey]) {
    result.push(json[outerKey][innerKey]);
  }
}

const data = [
  {
    date: '2024-2-21',
    num: 360,
  },
];

export default function HeatMap() {
  const cal = new CalHeatmap();

  cal.paint(
    {
      data: {
        source: data,
        x: 'date',
        y: 'num',
      },
    },
    [[Tooltip]],
  );

  return <div id="cal-heatmap">1</div>;
}
