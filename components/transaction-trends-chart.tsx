"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default function TransactionTrendsChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Generate dates for April 2023
    const dates = Array.from({ length: 30 }, (_, i) => `2023-04-${String(i + 1).padStart(2, "0")}`)

    // Generate random transaction counts (more realistic pattern)
    const generateTransactionCounts = () => {
      return dates.map((date, index) => {
        // Lower on weekends (assuming April 1, 2023 is a Saturday)
        const isWeekend = index % 7 === 0 || index % 7 === 6
        const baseCount = isWeekend ? 30 + Math.random() * 20 : 50 + Math.random() * 30

        // Add some trends - higher in middle of month and end of month
        const dayOfMonth = index + 1
        let multiplier = 1

        if (dayOfMonth === 15 || dayOfMonth === 30) {
          multiplier = 1.5 // Payday spike
        } else if (dayOfMonth > 25) {
          multiplier = 1.2 // End of month increase
        }

        return Math.round(baseCount * multiplier)
      })
    }

    // Generate random transaction amounts (correlated with counts but with variation)
    const generateTransactionAmounts = (counts: number[]) => {
      return counts.map((count) => {
        const avgAmount = 20000 + Math.random() * 10000 // Average transaction amount
        return Math.round((count * avgAmount) / 1000000) // Convert to millions
      })
    }

    const transactionCounts = generateTransactionCounts()
    const transactionAmounts = generateTransactionAmounts(transactionCounts)

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates.map((date) => date.substring(5)), // Show only MM-DD
          datasets: [
            {
              label: "Transaction Count",
              data: transactionCounts,
              backgroundColor: "rgba(124, 58, 237, 0.5)",
              borderColor: "rgba(124, 58, 237, 1)",
              borderWidth: 2,
              tension: 0.3,
              yAxisID: "y",
            },
            {
              label: "Transaction Amount (Millions RWF)",
              data: transactionAmounts,
              backgroundColor: "rgba(236, 72, 153, 0.5)",
              borderColor: "rgba(236, 72, 153, 1)",
              borderWidth: 2,
              tension: 0.3,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "Transaction Count",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                text: "Amount (Millions RWF)",
              },
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                callback: function (value, index) {
                  // Show every 3rd label to avoid crowding
                  return index % 3 === 0 ? this.getLabelForValue(value as number) : ""
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.datasetIndex === 0) {
                    label += context.parsed.y.toLocaleString()
                  } else {
                    label += "RWF " + (context.parsed.y * 1000000).toLocaleString()
                  }
                  return label
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
