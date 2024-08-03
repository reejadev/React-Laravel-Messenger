import React from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
    const [events, setEvents] = React.useState({});

    const emit = (name, data) => {
        if (events[name]) {
            for (let cb of events[name]) {
                cb(data);
            }
        }
    };

    const on = (name, cb) => {
        setEvents((prevEvents) => {
            const newEvents = { ...prevEvents };
            if (!newEvents[name]) {
                newEvents[name] = [];
            }
            newEvents[name].push(cb);
            return newEvents;
        });

        return () => {
            setEvents((prevEvents) => {
                const newEvents = { ...prevEvents };
                newEvents[name] = newEvents[name].filter((callback) => callback !== cb);
                return newEvents;
            });
        };
    };

    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBus = () => {
    return React.useContext(EventBusContext);
};
