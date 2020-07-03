import React from 'react';
import ReactDOM from 'react-dom';
import App from './urqlSub';


import { SubscriptionClient} from 'subscriptions-transport-ws';
import { Provider, Client, dedupExchange, fetchExchange, subscriptionExchange } from 'urql'


const portNum = parseInt(window.location.port) || 80;
const endURL = portNum >= 3000 && portNum <= 3999 ?
  window.location.hostname + ":8080"
  :
  window.location.hostname + ":" + portNum;

console.log("listen to: ", endURL);


const subscriptionClient = new SubscriptionClient(
  "ws://" + endURL + '/query',
  {
    reconnect: true,
  }
);
const client = new Client({
  url: window.location.protocol + "//" + endURL + '/query',
  exchanges: [
    dedupExchange,
    // cache,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
})

export default ReactDOM.render(
  <Provider value={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

