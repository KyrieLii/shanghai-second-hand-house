import { DualAxes } from '@ant-design/plots';
import dayjs from 'dayjs';

type Item = {
  date: Date;
  num: number;
  area: number;
};

export default function LineChart({ list }: { list: Item[] }) {
  const config = {
    data: list,
    xField: 'date',
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
