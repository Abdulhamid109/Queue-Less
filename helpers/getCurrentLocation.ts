export const getLocation = (): Promise<GeolocationPosition | null> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        resolve(null); // ← caller handles this case
                        break;
                    case error.POSITION_UNAVAILABLE:
                        resolve(null);
                        break;
                    case error.TIMEOUT:
                        resolve(null);
                        break;
                    default:
                        resolve(null);
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    });
};