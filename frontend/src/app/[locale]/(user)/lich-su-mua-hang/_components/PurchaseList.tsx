import React from "react";
import { InvoiceManagement } from "../types";
import PurchaseCard from "./PurchaseCard";

interface Props {
    loading: boolean;
    orders: InvoiceManagement[];
    expanded: string | null;
    setExpanded: (v: string | null) => void;
    PAGE_SIZE: number;
}

export default function PurchaseList({ loading, orders, expanded, setExpanded, PAGE_SIZE }: Props) {
    if (loading) {
        return (
            <>
                {[...Array(PAGE_SIZE)].map((_, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl shadow p-4 animate-pulse"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 bg-gray-200 rounded border border-gray-300"
                                        ></div>
                                    ))}
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    }
    if (orders.length === 0) {
        return <div className="p-8 text-center text-gray-500">Không có đơn hàng nào phù hợp.</div>;
    }
    return (
        <>
            {orders.map((order) => (
                <PurchaseCard
                    key={order.id}
                    order={order}
                    expanded={expanded}
                    setExpanded={setExpanded}
                />
            ))}
        </>
    );
}