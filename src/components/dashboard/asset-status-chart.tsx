"use client"

import * as React from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Asset } from "@/lib/types"
import { Label, Pie, PieChart, Cell } from "recharts"

const chartConfig = {
  operational: {
    label: "Operational",
    color: "hsl(var(--chart-1))",
  },
  warning: {
    label: "Warning",
    color: "hsl(var(--chart-4))",
  },
  fault: {
    label: "Fault",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

const COLORS = {
  Operational: chartConfig.operational.color,
  Warning: chartConfig.warning.color,
  Fault: chartConfig.fault.color,
};


export function AssetStatusChart({ assets }: { assets: Asset[] }) {
  const chartData = React.useMemo(() => {
    const counts = assets.reduce(
      (acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1
        return acc
      },
      {} as Record<Asset["status"], number>
    )
    return Object.entries(counts).map(([status, count]) => ({
      status: status,
      count: count,
      fill: COLORS[status as keyof typeof COLORS],
    }))
  }, [assets])

  const totalAssets = React.useMemo(() => {
    return assets.length
  }, [assets])

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Asset Status</CardTitle>
        <CardDescription>
          Live status of all {totalAssets} assets
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius="60%"
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAssets.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Assets
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.status}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex-1 pb-6 justify-center flex gap-4 text-sm">
        {chartData.map(item => (
            <div key={item.status} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{backgroundColor: item.fill}} />
                <span>{item.status} ({item.count})</span>
            </div>
        ))}
      </CardContent>
    </Card>
  )
}
