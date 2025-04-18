"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { Skeleton } from "./ui/skeleton"

Chart.register(...registerables)

const TransactionDistribution = ({ data = [], loading = false }) => {
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
      // Convert transaction_type to readable format
      const type = item.type.replace(/_/g, " ")
      return type.charAt(0).toUpperCase() + type.slice(1)
    })

    const counts = data.map((item) => item.count)

    // Color palette
    const backgroundColors = [
      "rgba(54, 162, 235, 0.8)",
      "rgba(255, 99, 132, 0.8)",
      "rgba(255, 206, 86, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(153, 102, 255, 0.8)",
      "rgba(255, 159, 64, 0.8)",
      "rgba(201, 203, 207, 0.8)",
      "rgba(94, 114, 228, 0.8)",
      "rgba(43, 206, 141, 0.8)",
    ]

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: backgroundColors.slice(0, data.length),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 15,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = context.raw
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = Math.round((value / total) * 100)
                  const amount = data[context.dataIndex].amount.toLocaleString() + " RWF"
                  return `${label}: ${percentage}% (${value} txns, ${amount})`
                },
              },
            },
          },
          cutout: "60%",
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

export default TransactionDistribution
