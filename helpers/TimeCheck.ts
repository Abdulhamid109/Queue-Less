// here we will be configuring the BET time status before each route



export function isCheckTime(BET: string) {

    const now = new Date();
    const [BETHour, BETMinute] = BET.split(':').map(Number);


    console.log("Date : " + now.toLocaleDateString());
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const TotalBET = BETHour * 60 + BETMinute;
    const TotalCurrentMins = currentHour * 60 + currentMinute;

    return TotalCurrentMins >= TotalBET;
}