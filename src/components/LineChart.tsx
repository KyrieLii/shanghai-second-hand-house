import { DualAxes } from '@ant-design/plots';
import { default as dataSource } from 'data/2024.json';

type Item = {
  date: string;
  num: number;
  area: number;
};
const list: Item[] = Object.values(dataSource)
  .flatMap((innerObj) => Object.values(innerObj))
  .map((item) => ({
    date: item.date,
    num: Number(item.num),
    area: Number(item.area),
  }));

console.log(list);

export default function LineChart() {
  const config = {
    data: list,
    xField: 'date',
    legend: true,
    children: [
      {
        type: 'line',
        yField: 'num',
        style: {
          stroke: '#5B8FF9',
          lineWidth: 2,
        },
        axis: {
          y: {
            title: 'num',
            style: { titleFill: '#5B8FF9' },
          },
        },
      },
      {
        type: 'line',
        yField: 'area',
        style: {
          stroke: '#5AD8A6',
          lineWidth: 2,
        },
        axis: {
          y: {
            position: 'right',
            title: 'area',
            style: { titleFill: '#5AD8A6' },
          },
        },
      },
    ],
  };
  return <DualAxes {...config} />;
}
