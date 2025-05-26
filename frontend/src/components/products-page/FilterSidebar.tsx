import { useState } from "react"
import { Slider, InputNumber, ConfigProvider } from "antd"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

type StatusType = "in_stock" | "out_of_stock" | "out_of_business"
type FilterState = {
    status: StatusType[]
    price: [number, number]
}

interface FilterSidebarProps {
    filters: FilterState
    onChange: (next: Partial<FilterState>) => void
}

const STATUS_OPTIONS: { value: StatusType; label: string }[] = [
    { value: "in_stock", label: "Còn hàng" },
    { value: "out_of_stock", label: "Hết hàng" },
    { value: "out_of_business", label: "Ngừng kinh doanh" }
]

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
    const [openStatus, setOpenStatus] = useState(true)
    const [openPrice, setOpenPrice] = useState(true)

    const handleStatusChange = (status: StatusType) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let nextStatus: StatusType[]
        if (e.target.checked) {
            nextStatus = [...filters.status, status]
        } else {
            nextStatus = filters.status.filter(s => s !== status)
        }
        onChange({ status: nextStatus })
    }

    const handlePriceChange = (val: number[] | number) => {
        if (Array.isArray(val) && val.length === 2) {
            onChange({ price: [val[0], val[1]] })
        }
    }
    const handleInputChange = (idx: 0 | 1, val: number | null) => {
        const next = [...filters.price] as [number, number]
        next[idx] = val ?? next[idx]
        onChange({ price: next })
    }
    const handleReset = () => {
        onChange({ status: [], price: [0, 10000000] })
    }

    return (
        <div className="space-y-6 p-2 md:p-0">
            {/* Trạng thái */}
            <div>
                <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setOpenStatus(v => !v)}>
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">Trạng thái</h3>
                        {openStatus
                            ? <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                            : <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        }
                    </div>
                    <span className="cursor-pointer text-gray-400 hover:text-gray-500" onClick={e => { e.stopPropagation(); handleReset(); }}>Reset</span>
                </div>
                {openStatus && (
                    <div className="mt-2 flex flex-col gap-1">
                        {STATUS_OPTIONS.map(opt => (
                            <label key={opt.value} className="inline-flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filters.status.includes(opt.value)}
                                    onChange={handleStatusChange(opt.value)}
                                    className="custom-checkbox"
                                />
                                <span className="text-sm text-gray-600">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
            {/* Giá */}
            <div>
                <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setOpenPrice(v => !v)}>
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">Giá</h3>
                        {openPrice
                            ? <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                            : <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        }
                    </div>
                    <span className="cursor-pointer text-gray-400 hover:text-gray-500" onClick={e => { e.stopPropagation(); handleReset(); }}>Reset</span>
                </div>
                {openPrice && (
                    <div className="mt-2">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Slider: {
                                        trackBg: "#000",
                                        railBg: "#d1d5db",
                                        handleColor: "#000",
                                        handleActiveColor: "#000",
                                        dotActiveBorderColor: "#000",
                                        handleActiveOutlineColor: "#000",
                                        trackHoverBg: "#000",
                                        railHoverBg: "#d1d5db",
                                    },
                                },
                            }}
                        >
                            <div className="w-full max-w-md mx-auto p-2">
                                <Slider
                                    range
                                    min={0}
                                    max={10000000}
                                    step={1000}
                                    value={filters.price}
                                    onChange={handlePriceChange}
                                />
                                <div className="flex justify-between items-center mt-4 gap-4">
                                    <InputNumber
                                        type="number"
                                        min={0}
                                        max={10000000}
                                        step={1000}
                                        value={filters.price[0]}
                                        onChange={v => handleInputChange(0, v)}
                                        style={{ width: 200 }}
                                        addonAfter={<span className="text-gray-500">VNĐ</span>}
                                    />
                                    {"-"}
                                    <InputNumber
                                        type="number"
                                        min={0}
                                        max={10000000}
                                        step={1000}
                                        value={filters.price[1]}
                                        onChange={v => handleInputChange(1, v)}
                                        style={{ width: 200 }}
                                        addonAfter={<span className="text-gray-500">VNĐ</span>}
                                    />
                                </div>
                            </div>
                        </ConfigProvider>
                    </div>
                )}
            </div>
        </div>
    )
}