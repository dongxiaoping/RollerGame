import { eventBus } from "./EventBus";

export class RollControlerBase {
    close() {
        eventBus.clearAll()
    }
}
