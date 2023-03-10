import React, { Fragment, memo, useState } from "react"
import memoize from "memoize-one"
import { FixedSizeList as List, areEqual } from "react-window"
import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline"
import { classNames } from "../utils/common.util"
import { type CountryData } from "../types"

interface ICountrySelector {
  countries: CountryData[]
  onSelection: (country: string) => void
}

const createItemData = memoize((countries: CountryData[]) => ({
  countries
}))

const CountrySelector: React.FC<ICountrySelector> = ({ countries, onSelection }): JSX.Element => {
  const [selected, setSelected] = useState<CountryData | undefined>()
  const itemData = createItemData(countries)

  return (
    <Listbox
      value={selected}
      onChange={(selection) => {
        setSelected(selection)
        onSelection(selection!.name.common)
      }}
    >
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700 sr-only">Select country ...</Listbox.Label>
          <div className="relative">
            <Listbox.Button className="relative w-full py-3 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 sm:text-sm">
              {selected ? (
                <span className="flex items-center">
                  <img src={selected.flags.png} alt="Flag Icon" className="flex-shrink-0 w-8 h-6 rounded-sm" />
                  <span className="block ml-3 truncate">{selected.name.common}</span>
                </span>
              ) : (
                <span className="flex items-center">
                  <div className="flex-shrink-0 h-6" />
                  <span className="block ml-3 truncate">Please select a country ...</span>
                </span>
              )}

              <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
                <ChevronUpDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-hidden text-base bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <List
                  height={160}
                  itemCount={countries.length}
                  itemData={itemData.countries}
                  itemSize={40}
                  width="100%"
                  className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
                >
                  {CountryEntry}
                </List>
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

const CountryEntry = memo(
  ({ data, index, style }: { data: CountryData[]; index: number; style: React.CSSProperties }) => {
    const country = data[index]
    return (
      <Listbox.Option
        key={country.name.common}
        style={style}
        value={country}
        className={({ active }) =>
          classNames(
            active ? "text-white bg-blue-600" : "text-gray-900",
            "cursor-default select-none relative py-2 pl-3 pr-9"
          )
        }
      >
        {({ selected, active }) => (
          <>
            <div className="flex items-center">
              <img src={country.flags.png} alt="Flag Icon" className="flex-shrink-0 w-8 h-6 rounded-sm" />
              <span className={classNames(selected ? "font-semibold" : "font-normal", "ml-3 block truncate")}>
                {country.name.common}
              </span>
            </div>

            {selected && (
              <span
                className={classNames(
                  active ? "text-white" : "text-blue-600",
                  "absolute inset-y-0 right-0 flex items-center pr-4"
                )}
              >
                <CheckIcon className="w-5 h-5" aria-hidden="true" />
              </span>
            )}
          </>
        )}
      </Listbox.Option>
    )
  },
  areEqual
)

CountryEntry.displayName = "CountryEntry"

export default CountrySelector
