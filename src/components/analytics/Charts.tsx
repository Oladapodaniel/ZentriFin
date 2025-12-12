"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
}

export function CashFlowChart({ data }: ChartProps) {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Cash Flow Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                            dataKey="name"
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
                            itemStyle={{ color: "var(--foreground)" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="inflow"
                            stroke="var(--chart-2)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="outflow"
                            stroke="var(--destructive)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function CategoryChart({ data }: ChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
                            itemStyle={{ color: "var(--foreground)" }}
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {data.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
