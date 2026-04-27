"use client";
import Admin_navbar from "@/components/admin_navbar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface BusinessFormat {
    BusinessName: string;
    BusinessAddress: string;
    BST: string;
    BET: string;
    CustomerLimitPerDay: string;
}

interface FeedbackFormat {
    _id: string;
    Title: string;
    Description: string;
}

interface ServiceDetails {
    _id: string;
    name: string;
    AvgDurationPerCustomer: string;
    ChargesPerService: string;
}

const Page = () => {
    const { id } = useParams();
    const [businessLoader, setBusinessLoader] = useState<boolean>(true);
    const [data, setData] = useState<BusinessFormat>({
        BusinessName: "",
        BusinessAddress: "",
        BST: "",
        BET: "",
        CustomerLimitPerDay: ""
    });
    const [inputDate, setInputDate] = useState<string>('');
    const [bookingLoader, setBookingLoader] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [feedbackData, SetFeedbackData] = useState<FeedbackFormat[]>([])
    const [secondFeebackLoader, setSecondFeedbackLoader] = useState<boolean>(false);
    const [Expense,setExpense] = useState<string>('');
    const [expenseLoader,setExpenseLoader] = useState<boolean>(false);

    const FetchBusinessDetails = async () => {
        setBusinessLoader(true)
        try {
            const response = await fetch(`/api/customer/getBusiness?id=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            });

            const result = await response.json();
            if (!response.ok) {
                toast.error(result.error || "Something went wrong!")
            } else {
                setData({
                    BusinessName: result.business.BusinessName,
                    BusinessAddress: result.business.BusinessAddress,
                    BST: result.time.BST,
                    BET: result.time.BET,
                    CustomerLimitPerDay: result.time.CustomerLimitPerDay
                });
            }

        } catch (error) {
            console.log("Error => " + error);
            if (error instanceof Error) {
                toast.error(error.message)
            }
        } finally {
            setBusinessLoader(false);
        }
    }

    //   today's opertional data will be displayed after the shop end time
    //   based on date w'll do the booking operations
    const ViewAllBooking = async () => {
        setBookingLoader(true);
        try {
            const response = await fetch(`/api/admin/allbookings?id=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(inputDate)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!")
            } else {
                console.log("all Bookings displayed!");
                setCount(result.count);
                setShowResult(true);
            }
        } catch (error) {
            console.log("Error => " + error);
            if (error instanceof Error) {
                toast.error(error.message)
            }
        } finally {
            setBookingLoader(false);
        }

    }

    const ViewCancelledBookings = async () => {
        setBookingLoader(true);
        try {
            const response = await fetch(`/api/admin/cancelledbookings?id=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(inputDate)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!")
            } else {
                console.log("cancelled Bookings displayed!");
                setCount(result.count);
                setShowResult(true);
            }
        } catch (error) {
            console.log("Error => " + error);
            if (error instanceof Error) {
                toast.error(error.message)
            }
        } finally {
            setBookingLoader(false);
        }

    }

    const ViewCompletedBookings = async () => {
        setBookingLoader(true);
        try {
            const response = await fetch(`/api/admin/completedbookings?id=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(inputDate)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!")
            } else {
                console.log("completed Bookings displayed!");
                setCount(result.count);
                setShowResult(true);
            }
        } catch (error) {
            console.log("Error => " + error);
            if (error instanceof Error) {
                toast.error(error.message)
            }
        } finally {
            setBookingLoader(false);
        }

    }

    //   expense details based on date

    const CalculatingExpenseDetails = async () => {
        setExpenseLoader(true);
        // total customer successfully completed service along with total price
        try {
            const response = await fetch(`/api/admin/expensedetails?id=${id}`,{
                headers:{'Content-Type':'application/json'},
                method:'POST',
                body:JSON.stringify(inputDate)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!")
            } else {
                console.log("Total Expense displayed!"+result.expense);
                setExpense(result.expense);
                setShowResult(true);
            }
        } catch (error) {
            console.log("Error => "+error);
            if(error instanceof Error){
                toast.error(error.message);
            }
        }finally{
            setExpenseLoader(false);
        }
    }

    //   total queue's successfull vs failure

    //  Customer Feedback for the business
    const handleCancel = () => {
        setInputDate('');
        setShowResult(false);
        setCount(0);
    }

    

    const fetchCustomerFeedbacks = async () => {
        setSecondFeedbackLoader(true);
        try {
            const response = await fetch(`/api/customer/readfeedbacks?id=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            } else {
                SetFeedbackData(result.feedbacks);
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error("Something went wrong!");
                console.log("Error => " + error);
            }
        } finally {
            setSecondFeedbackLoader(false);
        }
    }


useEffect(() => {
        FetchBusinessDetails();
        fetchCustomerFeedbacks()
    }, []);

    if (businessLoader) {
        return (
            <div className='p-2 flex justify-center items-center h-screen w-screen animate-pulse'>
                Fetching the business data... Kindly wait.
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Admin_navbar />

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

                <section className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-gray-700 to-gray-400 text-transparent bg-clip-text">
                        Admin Options
                    </h1>

                    <div className="grid md:grid-cols-3 gap-6">


                        <Dialog>
                            <DialogTrigger>
                                <div
                                    className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                    <p className="text-lg font-medium text-gray-700">View all bookings</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent
                                onInteractOutside={(e) => e.preventDefault()}
                                showCloseButton={false}
                            >
                                <DialogHeader className="text-center">Select Date</DialogHeader>
                                <DialogDescription>
                                    <div className="flex flex-col gap-2">
                                        {/* ← changed from !count to showResult flag */}
                                        {!showResult ? (
                                            <>
                                                <input type="date"
                                                max={new Date().toISOString().split("T")[0]}
                                                className="flex justify-center items-center min-w-full focus:outline border p-2 rounded-md" onChange={(e) => setInputDate(e.target.value)} />
                                                <p className="p-2 text-center">Selected Date : {inputDate}</p>
                                            </>
                                        ) : (
                                            <div className="text-center py-4 text-gray-800 text-lg">
                                                Total Number of People booked: <span className="font-bold">{count}</span>
                                            </div>
                                        )}
                                    </div>

                                </DialogDescription>
                                <DialogFooter>
                                    <div className="text-white flex justify-between items-center min-w-full text-center">
                                        {/* ← only show Next when date selected and result not shown yet */}
                                        {(inputDate !== '' && !showResult) && (
                                            <button className="bg-blue-500 rounded-md p-2" disabled={bookingLoader} onClick={ViewAllBooking}>
                                                {bookingLoader ? "loading.." : "Next"}
                                            </button>
                                        )}
                                        <DialogClose asChild>
                                            <button
                                                onClick={handleCancel}
                                                className="bg-red-400 p-2 rounded-md">Cancel</button>
                                        </DialogClose>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger>
                                <div
                                    className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                    <p className="text-lg font-medium text-gray-700">Cancelled bookings</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent
                                onInteractOutside={(e) => e.preventDefault()}
                                showCloseButton={false}
                            >
                                <DialogHeader className="text-center">Select Date</DialogHeader>
                                <DialogDescription>
                                    <div className="flex flex-col gap-2">
                                        {/* ← changed from !count to showResult flag */}
                                        {!showResult ? (
                                            <>
                                                <input type="date" 
                                                max={new Date().toISOString().split("T")[0]}
                                                className="flex justify-center items-center min-w-full focus:outline border p-2 rounded-md" onChange={(e) => setInputDate(e.target.value)} />
                                                <p className="p-2 text-center">Selected Date : {inputDate}</p>
                                            </>
                                        ) : (
                                            <div className="text-center py-4 text-gray-800 text-lg">
                                                Total Number of People cancelled: <span className="font-bold">{count}</span>
                                            </div>
                                        )}
                                    </div>

                                </DialogDescription>
                                <DialogFooter>
                                    <div className="text-white flex justify-between items-center min-w-full text-center">
                                        {/* ← only show Next when date selected and result not shown yet */}
                                        {(inputDate !== '' && !showResult) && (
                                            <button className="bg-blue-500 rounded-md p-2" disabled={bookingLoader} onClick={ViewCancelledBookings}>
                                                {bookingLoader ? "loading.." : "Next"}
                                            </button>
                                        )}
                                        <DialogClose asChild>
                                            <button
                                                onClick={handleCancel}
                                                className="bg-red-400 p-2 rounded-md">Cancel</button>
                                        </DialogClose>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger>
                                <div
                                    className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                    <p className="text-lg font-medium text-gray-700">Completed bookings</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent
                                onInteractOutside={(e) => e.preventDefault()}
                                showCloseButton={false}
                            >
                                <DialogHeader className="text-center">Select Date</DialogHeader>
                                <DialogDescription>
                                    <div className="flex flex-col gap-2">
                                        {/* ← changed from !count to showResult flag */}
                                        {!showResult ? (
                                            <>
                                                <input type="date" 
                                                max={new Date().toISOString().split("T")[0]}
                                                className="flex justify-center items-center min-w-full focus:outline border p-2 rounded-md" onChange={(e) => setInputDate(e.target.value)} />
                                                <p className="p-2 text-center">Selected Date : {inputDate}</p>
                                            </>
                                        ) : (
                                            <div className="text-center py-4 text-gray-800 text-lg">
                                                Total Number of People Completed: <span className="font-bold">{count}</span>
                                            </div>
                                        )}
                                    </div>

                                </DialogDescription>
                                <DialogFooter>
                                    <div className="text-white flex justify-between items-center min-w-full text-center">
                                        {/* ← only show Next when date selected and result not shown yet */}
                                        {(inputDate !== '' && !showResult) && (
                                            <button className="bg-blue-500 rounded-md p-2" disabled={bookingLoader} onClick={ViewCompletedBookings}>
                                                {bookingLoader ? "loading.." : "Next"}
                                            </button>
                                        )}
                                        <DialogClose asChild>
                                            <button
                                                onClick={handleCancel}
                                                className="bg-red-400 p-2 rounded-md">Cancel</button>
                                        </DialogClose>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                    </div>
                </section>

                <section className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-gray-700 to-gray-400 text-transparent bg-clip-text">
                        Business Details
                    </h1>

                    <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-md  p-1">
                            Business Name : {data.BusinessName}
                        </p>
                        <p className="text-gray-500 text-md  p-1">
                            Business Address : {data.BusinessAddress}
                        </p>
                        <p className="text-gray-500 text-md  p-1">
                            Business Start Time : {data.BST}
                        </p>
                        <p className="text-gray-500 text-md  p-1">
                            Business End Time : {data.BET}
                        </p>
                        <p className="text-gray-500 text-md  p-1">
                            Customer Limit : {data.CustomerLimitPerDay}
                        </p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-gray-700 to-gray-400 text-transparent bg-clip-text">
                        Analysis Report
                    </h1>

                    <div className="grid md:grid-cols-2 gap-6">
                        
                            <Dialog>
                            <DialogTrigger>
                                <div
                                    className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                    <p className="text-lg font-medium text-gray-700">Calculate the expense details</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent
                                onInteractOutside={(e) => e.preventDefault()}
                                showCloseButton={false}
                            >
                                <DialogHeader className="text-center">Select Date</DialogHeader>
                                <DialogDescription>
                                    <div className="flex flex-col gap-2">
                                        {!showResult ? (
                                            <>
                                                <input type="date" 
                                                max={new Date().toISOString().split("T")[0]}
                                                className="flex justify-center items-center min-w-full focus:outline border p-2 rounded-md" onChange={(e) => setInputDate(e.target.value)} />
                                                <p className="p-2 text-center">Selected Date : {inputDate}</p>
                                            </>
                                        ) : (
                                            <div className="text-center py-4 text-gray-800 text-lg">
                                                Total Expense Generated: <span className="font-bold">{Expense}</span>
                                            </div>
                                        )}
                                    </div>

                                </DialogDescription>
                                <DialogFooter>
                                    <div className="text-white flex justify-between items-center min-w-full text-center">
                                        {(inputDate !== '' && !showResult) && (
                                            <button className="bg-blue-500 rounded-md p-2" disabled={expenseLoader} onClick={CalculatingExpenseDetails}>
                                                {expenseLoader ? "loading.." : "Next"}
                                            </button>
                                        )}
                                        <DialogClose asChild>
                                            <button
                                                onClick={handleCancel}
                                                className="bg-red-400 p-2 rounded-md">Cancel</button>
                                        </DialogClose>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                            <div
                                className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            >
                                <p className="text-lg font-medium text-gray-700">Graphical Representation of Queue</p>
                            </div>
                        
                    </div>
                </section>

                <section className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-gray-700 to-gray-400 text-transparent bg-clip-text">
                        Customer Feedback
                    </h1>

                    <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                        {
                            secondFeebackLoader ?
                                <p className="text-gray-500 text-sm animate-pulse">
                                    Fetching Your Feedback insights.....
                                </p> : feedbackData.length === 0 ?
                                    <p className="text-gray-500 text-sm">
                                        No Feedbacks at the moment
                                    </p> : feedbackData.map((d: FeedbackFormat,i:number) => (
                                        <div
                                            key={d._id}
                                            className="text-gray-500 text-sm flex flex-col gap-2 rounded-md border p-2 m-1">
                                                <p className="font-bold text-xs">user {i+1}</p>
                                            <p>Title : {d.Title}</p>
                                            <p>Description : {d.Description}</p>
                                        </div>
                                    ))
                        }
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Page;