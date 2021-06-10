export enum EventTypes {
    Cancel = "cancel",
    Cloned = "cloned",
    Drag = "drag",
    DragEnd = "dragend",
    Drop = "drop",
    Out = "out",
    Over = "over",
    Remove = "remove",
    Shadow = "shadow",
    DropModel = "dropModel",
    RemoveModel = "removeModel",
}

export const AllEvents: EventTypes[] = Object.keys(EventTypes).map(k => EventTypes[k as keyof typeof EventTypes] as EventTypes);