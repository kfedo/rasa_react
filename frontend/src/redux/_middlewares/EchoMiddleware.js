// import Echo from 'laravel-echo';

// import * as io from 'socket.io-client';


// const echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: 'true',
//     encrypted: true,
//
// });

export const echoMiddleware = store => next => action => {
    switch (action.type) {
        case 'ADD_CHANNEL_LISTENER':
            // echo.channel(action.payload.channel)
            //     .listen(action.payload.action, action.payload.callback);
            // console.log('created channel');
    }

    next(action);
};
