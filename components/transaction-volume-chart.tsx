"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default function TransactionVolumeChart() {
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
      "Payments to Code",
      "Transfers to Mobile",
      "Bank Deposits",
      "Airtime Payments",
      "Cash Power",
      "Agent Withdrawals",
    ]

    const transactionCounts = [412, 287, 356, 124, 198, 98, 112]
    const transactionAmounts = [12560000, 4320000, 8750000, 7450000, 250000, 1960000, 2174000]

    // Convert to millions for better display
    const amountsInMillions = transactionAmounts.map((amount) => amount / 1000000)

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [
            {
              label: "Transaction Count",
              data: transactionCounts,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
              yAxisID: "y",
            },
            {
              label: "Transaction Amount (Millions RWF)",
              data: amountsInMillions,
              backgroundColor: "rgba(16, 185, 129, 0.5)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 1,
              type: "line",
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
