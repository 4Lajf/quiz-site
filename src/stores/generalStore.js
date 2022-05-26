export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function refresh() {
    setTimeout(function () {
        window.location.reload();
    }, 500);
}