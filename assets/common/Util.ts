export function randEventId(): string {
    return `roll_${new Date().getTime()}_${Math.ceil(
        Math.random() * 10
    )}`
}