import React, { Fragment, memo, useCallback } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"
import { Line } from "react-chartjs-2"
import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import memoize from "memoize-one"
import { FixedSizeList as List, areEqual } from "react-window"

import Spinner from "./common/spinner"
import { useApi } from "../providers/ApiProvider"
import { classNames } from "../utils/common.util"
import { type CoronaData, type CoronaProperty } from "../types"

interface ICoronaDataModal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const
    }
  }
}

const createItemData = memoize((coronaData: CoronaData[]) => ({
  coronaData
}))

const CoronaDataModal: React.FC<ICoronaDataModal> = ({ open, setOpen }) => {
  const { isLoadingCorona, coronaData } = useApi()
  const itemData = createItemData(coronaData)

  const formatDate = useCallback((date: Date | string) => {
    date = new Date(date)
    return `${date.getMonth() + 1}/${date.getFullYear()}`
  }, [])

  const labels = useCallback(() => {
    return [...new Set(coronaData.map((c) => formatDate(c.Date)))]
  }, [coronaData])

  const calculateDateForProp = useCallback(
    (property: CoronaProperty) => {
      const data = []
      let index = 0
      let count = 0
      let startDate = formatDate(coronaData[0].Date)

      for (const point of coronaData) {
        const pointDate = formatDate(point.Date)

        if (pointDate === startDate) {
          index++
          count += point[property]!
          continue
        }

        // calculate average of month
        data.push(count / index)

        // save first point of new date
        index = 1
        count = point[property]!
        startDate = pointDate
      }

      data.push(count / index)

      return data
    },
    [coronaData]
  )

  const deathsDataset = useCallback(() => {
    return {
      label: "Deaths",
      data: calculateDateForProp("Deaths"),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)"
    }
  }, [labels])

  const activeDataset = useCallback(() => {
    return {
      label: "Active",
      data: calculateDateForProp("Active"),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    }
  }, [labels])

  const confirmedDataset = useCallback(() => {
    return {
      label: "Confirmed",
      data: calculateDateForProp("Confirmed"),
      borderColor: "rgb(0, 205, 101)",
      backgroundColor: "rgba(0, 205, 101, 0.5)"
    }
  }, [labels])

  const chartData = useCallback(() => {
    return {
      labels: labels(),
      datasets: [activeDataset(), deathsDataset(), confirmedDataset()]
    }
  }, [activeDataset, deathsDataset, confirmedDataset])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
        <div className="flex min-h-screen text-center md:block md:px-2 lg:px-4" style={{ fontSize: 0 }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 hidden transition-opacity bg-gray-500 bg-opacity-75 md:block" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div className="flex w-full text-base text-left transition md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
              <div className="relative flex items-center w-full px-4 pb-8 overflow-hidden bg-white shadow-2xl pt-14 sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button
                  type="button"
                  className="absolute text-gray-400 top-4 right-4 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                <div className="w-full sm:px-6">
                  <h2 className="text-xl font-medium text-gray-900 sm:pr-12">Corona Data</h2>

                  <section aria-labelledby="information-heading" className="mt-4">
                    <h3 id="information-heading" className="sr-only">
                      Corona Data
                    </h3>

                    <div className="pt-5 border-t border-gray-200">
                      {isLoadingCorona && <Spinner />}
                      {!isLoadingCorona ? (
                        <>
                          {coronaData.length ? (
                            <>
                              <Line options={options} data={chartData()} />
                              <div className="flex flex-col mt-4">
                                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="table w-full table-fixed bg-gray-50">
                                          <tr>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                              Date
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                              Active
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                              Deaths
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                              Confirmed
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                            >
                                              Recovered
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="block overflow-hidden">
                                          <List
                                            height={260}
                                            itemCount={coronaData.length}
                                            itemData={itemData.coronaData}
                                            itemSize={52}
                                            width="100%"
                                          >
                                            {TableEntry}
                                          </List>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-gray-800">No data available</div>
                          )}
                        </>
                      ) : null}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const TableEntry = memo(({ data, index, style }: { data: CoronaData[]; index: number; style: React.CSSProperties }) => {
  const d = data[index]
  return (
    <tr
      style={style}
      key={index}
      className={classNames("table table-fixed w-full", index % 2 === 0 ? "bg-white" : "bg-gray-50")}
    >
      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
        {new Date(d.Date).toLocaleDateString("de-DE")}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{d.Active}</td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{d.Deaths}</td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{d.Confirmed}</td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{d.Recovered}</td>
    </tr>
  )
}, areEqual)

TableEntry.displayName = "TableEntry"

export default CoronaDataModal
