import React, { createContext, useContext, useState } from "react"

import { type CoronaData, type CountryData } from "../types"
import { useNotification } from "./NotificationProvider"

const CORONA_API_URL = "https://api.covid19api.com/country"
const COUNTRY_API_URL = "/country/api" // http://localhost:8081/api/all

const useApiProvider = () => {
  const { showNotification } = useNotification()

  const [isLoadingCountries, setLoadingCountries] = useState<boolean>(false)
  const [isLoadingCorona, setLoadingCorona] = useState<boolean>(false)
  const [countries, setCountries] = useState<CountryData[]>([])
  const [coronaData, setCoronaData] = useState<CoronaData[]>([])

  const fetchCorona = async (country: string) => {
    try {
      setLoadingCorona(true)
      const response = await fetch(`${CORONA_API_URL}/${country.toLowerCase()}`)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const coronaData = (await response.json()) as CoronaData[]
      setCoronaData(coronaData)
      return coronaData
    } catch (err) {
      showNotification({ type: "error", message: `Error fetching corona data from API. ${err}` })
    } finally {
      setLoadingCorona(false)
    }
  }

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true)
      const response = await fetch(`${COUNTRY_API_URL}/all`)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const countries = (await response.json()) as CountryData[]
      countries.sort((a, b) => a.name.common.localeCompare(b.name.common))
      setCountries(countries)
      return countries
    } catch (err) {
      showNotification({ type: "error", message: `Error fetching countries from API. ${err}` })
    } finally {
      setLoadingCountries(false)
    }
  }

  return { isLoadingCountries, isLoadingCorona, countries, coronaData, fetchCountries, fetchCorona }
}

export const ApiContext = createContext({})

export const ApiProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const value = useApiProvider()

  return <ApiContext.Provider value={value}>{props.children}</ApiContext.Provider>
}

export const useApi = (): ReturnType<typeof useApiProvider> =>
  useContext(ApiContext) as ReturnType<typeof useApiProvider>
