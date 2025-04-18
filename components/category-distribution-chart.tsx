"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default function CategoryDistributionChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Sample data
    const categories = [
      "Incoming Money",
      "Transfers to Mobile",
      "Payments to Code",
      "Bank Deposits",
      "Airtime Payments",
      "Cash Power",
      "Agent Withdrawals",
    ]

    const percentages = [26, 22, 18, 8, 12, 6, 8]

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: categories,
          datasets: [
            {
              data: percentages,
              backgroundColor: [
                "rgba(59, 130, 246, 0.7)",
                "rgba(16, 185, 129, 0.7)",
                "rgba(245, 158, 11, 0.7)",
                "rgba(236, 72, 153, 0.7)",
                "rgba(139, 92, 246, 0.7)",
                "rgba(239, 68, 68, 0.7)",
                "rgba(75, 85, 99, 0.7)",
              ],
              borderColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(236, 72, 153, 1)",
                "rgba(139, 92, 246, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(75, 85, 99, 1)",
              ],
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
                  const value = context.parsed || 0
                  return `${label}: ${value}%`
                },
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
