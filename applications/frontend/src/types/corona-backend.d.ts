export type CoronaProperty = "Confirmed" | "Deaths" | "Recovered" | "Active"

export type CoronaData = {
  Country: string
  Date: string
  Confirmed?: number
  Deaths?: number
  Recovered?: number
  Active?: number
}
