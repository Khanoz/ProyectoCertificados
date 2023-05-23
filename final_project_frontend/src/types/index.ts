// Eventos
export interface IEvent {
    eventName: String,
    eventPlace: String,
    eventImage: String[],
    eventDate: Date,
    eventCapacity: Number,
    eventDescription: String,
}

export interface IEventListRequest {
    limit: Number,
    filter: EventFilter,
    query?: String,  // En caso de que el filtro sea "search"
}

export interface IEventListResponse {
    events: IEvent[],
    qty: Number,
}

// Usuario
export interface IUser {
    name: String,
    lastName: String,
    birthday: Date,
    isActive: Boolean,
    imageUrl: String,
}

export interface IJWTToken {
    id: string,
    iat: number,
    exp: number
}