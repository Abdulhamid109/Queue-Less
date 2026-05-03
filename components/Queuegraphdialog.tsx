"use client";
// ── Drop this Dialog block in place of the "Graphical Representation of Queue" div ──
// Imports to add at the top of your file:
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";

// ── Add these to your existing state declarations ──
// const [graphDate, setGraphDate]           = useState<string>('');
// const [graphLoader, setGraphLoader]       = useState<boolean>(false);
// const [graphData, setGraphData]           = useState<GraphFormat | null>(null);
// const [graphResult, setGraphResult]       = useState<boolean>(false);

interface GraphFormat {
    total: number;
    completed: number;
    cancelled: number;
}

// ── Add this function alongside your other fetch functions ──
const FetchQueueGraphData = async (
    id: string | string[],
    graphDate: string,
    setGraphLoader: (v: boolean) => void,
    setGraphData: (v: GraphFormat) => void,
    setGraphResult: (v: boolean) => void
) => {
    setGraphLoader(true);
    try {
        // Single API call that returns all three counts for the selected date.
        // Expected response shape: { total: number, completed: number, cancelled: number }
        // You can also merge three existing endpoints into one here if preferred.
        const response = await fetch(`/api/admin/queuestats?id=${id}`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(graphDate),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Something went wrong!");

        setGraphData({
            total: result.total,
            completed: result.completed,
            cancelled: result.cancelled,
        });
        setGraphResult(true);
    } catch (error) {
        if (error instanceof Error) toast.error(error.message);
    } finally {
        setGraphLoader(false);
    }
};

// ── Chart data builder ──
function buildChartData(graphData: GraphFormat) {
    return [
        {
            name: "Queue overview",
            Total: graphData.total,
            Completed: graphData.completed,
            Cancelled: graphData.cancelled,
            Pending: Math.max(0, graphData.total - graphData.completed - graphData.cancelled),
        },
    ];
}

// ── Stat pill used inside the result view ──
function StatPill({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 flex-1">
            <span className={`text-2xl font-semibold ${color}`}>{value}</span>
            <span className="text-xs text-slate-400 mt-0.5">{label}</span>
        </div>
    );
}

// ── Drop-in replacement for the "Graphical Representation" div ──
export function QueueGraphDialog({ id }: { id: string }) {
    const [graphDate, setGraphDate] = useState<string>("");
    const [graphLoader, setGraphLoader] = useState<boolean>(false);
    const [graphData, setGraphData] = useState<GraphFormat | null>(null);
    const [graphResult, setGraphResult] = useState<boolean>(false);

    const handleCancel = () => {
        setGraphDate("");
        setGraphData(null);
        setGraphResult(false);
    };

    const chartData = graphData ? buildChartData(graphData) : [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <p className="text-lg font-medium text-gray-700">
                        Graphical representation of queue
                    </p>
                </div>
            </DialogTrigger>

            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                showCloseButton={false}
                className="max-w-lg rounded-2xl"
            >
                <DialogHeader className="text-center text-base font-semibold text-slate-800">
                    Queue statistics
                </DialogHeader>

                <DialogDescription asChild>
                    <div className="flex flex-col gap-4">
                        {!graphResult ? (
                            /* ── Date picker ── */
                            <>
                                <input
                                    type="date"
                                    max={new Date().toISOString().split("T")[0]}
                                    value={graphDate}
                                    onChange={(e) => setGraphDate(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                {graphDate && (
                                    <p className="text-center text-xs text-slate-400">
                                        Viewing:{" "}
                                        {new Date(graphDate + "T00:00:00").toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                )}
                            </>
                        ) : graphData ? (
                            /* ── Results ── */
                            <div className="space-y-5">

                                {/* Stat pills */}
                                <div className="flex gap-3">
                                    <StatPill label="Total"     value={graphData.total}     color="text-slate-700" />
                                    <StatPill label="Completed" value={graphData.completed} color="text-emerald-600" />
                                    <StatPill label="Cancelled" value={graphData.cancelled} color="text-rose-500" />
                                    <StatPill
                                        label="Pending"
                                        value={Math.max(0, graphData.total - graphData.completed - graphData.cancelled)}
                                        color="text-amber-500"
                                    />
                                </div>

                                {/* Bar chart */}
                                <div className="w-full h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                            barCategoryGap="30%"
                                            barGap={4}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                allowDecimals={false}
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: "10px",
                                                    border: "0.5px solid #e2e8f0",
                                                    fontSize: "12px",
                                                    boxShadow: "none",
                                                }}
                                                cursor={{ fill: "#f8fafc" }}
                                            />
                                            <Legend
                                                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                                            />
                                            <Bar dataKey="Total"     fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Cancelled" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Pending"   fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Completion rate */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                                    <p className="text-xs text-slate-400 mb-1">Completion rate</p>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${graphData.total > 0
                                                    ? Math.round((graphData.completed / graphData.total) * 100)
                                                    : 0}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 text-right">
                                        {graphData.total > 0
                                            ? Math.round((graphData.completed / graphData.total) * 100)
                                            : 0}
                                        %
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </DialogDescription>

                <DialogFooter>
                    <div className="flex justify-between items-center w-full gap-3 mt-1">
                        {graphDate && !graphResult && (
                            <button
                                onClick={() =>
                                    FetchQueueGraphData(
                                        id,
                                        graphDate,
                                        setGraphLoader,
                                        setGraphData,
                                        setGraphResult
                                    )
                                }
                                disabled={graphLoader}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-xl transition-colors"
                            >
                                {graphLoader ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Loading…
                                    </span>
                                ) : (
                                    "Fetch stats"
                                )}
                            </button>
                        )}
                        <DialogClose asChild>
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}