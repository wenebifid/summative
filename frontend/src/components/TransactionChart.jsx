"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { Skeleton } from "./ui/skeleton"

Chart.register(...registerables)

const TransactionChart = ({ data = [], loading = false }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (loading || !chartRef.current || !data.length) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Prepare data
    const labels = data.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    const amounts = data.map((item) => item.amount)
    const counts = data.map((item) => item.count)

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Amount",
              data: amounts,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
              fill: true,
              yAxisID: "y",
            },
            {
              label: "Count",
              data: counts,
              borderColor: "rgb(249, 115, 22)",
              backgroundColor: "rgba(249, 115, 22, 0.1)",
              tension: 0.3,
              fill: true,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              type: "linear",
              display: true,
              position: "left",
              beginAtZero: true,
              title: {
                display: true,
                text: "Amount (RWF)",
              },
              ticks: {
                callback: (value) => value.toLocaleString() + " RWF",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              beginAtZero: true,
              title: {
                display: true,
                text: "Count",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, loading])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <div className="h-[300px] w-full">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No data available for the selected period
        </div>
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  )
}

export default TransactionChart
