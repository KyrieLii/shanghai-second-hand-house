import dayjs from 'dayjs';
import { useMemo } from 'react';

import { DualAxes } from '@ant-design/plots';
import { default as dataSource } from 'data/2024.json';

export type Item = {
  date: Date;
  num: number;
  //   area: number;
};

export default function LineChart() {
  const list = useMemo<Item[]>(() => {
    return Object.values(dataSource)
      .flatMap((innerObj) => Object.values(innerObj))
      .map((item) => ({
        date: dayjs(item.date).toDate(),
        num: Number(item.num),
        // area: Number(item.area),
      }));
  }, []);

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
      //   {
      //     type: 'line',
      //     yField: 'area',
      //     style: {
      //       stroke: '#5AD8A6',
      //       lineWidth: 2,
      //     },
      //     axis: {
      //       y: {
      //         position: 'right',
      //         title: 'area',
      //         style: { titleFill: '#5AD8A6' },
      //       },
      //     },
      //   },
    ],
  };
  return <DualAxes {...config} />;
}
