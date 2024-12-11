import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function BarChart({ data, xAxis, yAxis, title }) {
  return (
    <div className="w-full h-[400px]">
      <RechartsBarChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        title={title}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yAxis} fill="#1E293B" />
      </RechartsBarChart>
    </div>
  );
}
