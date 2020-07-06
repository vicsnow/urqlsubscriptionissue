# urqlsubscriptionissue
## Issue description 
Urql does not unsubscribe, when the query variables change in a specific way.

### Schema 
Schema has one single subscription: ``` driveWindowChanged(page: Int!, count: Int!): [GuiDriveDraw!]! ``` 
 - Ignore the "page" variable it will be the same  
 - `count` is an ammount of elements requested

### Frontend

Frontend has 3 containers with the same `driveWindowChanged` subscription, but mutable `count`

So there are 3 queries
- q1 = driveWindowChanged(page: 1, count: 30) 
- q2 = driveWindowChanged(page: 1, count: 60) 
- q3 = driveWindowChanged(page: 1, count: 120) 

Each button on the left represents a certain query combination of these queries 
For exapmle `q113` means 
- container 1 query is q1
- container 2 query is q1
- container 3 query is q3

`q113` is set as a default state

Each cell on the right has a number of elements it recieved, `count` in other words
### Backend

Has a default `gqlgen` skeleton and an almost default web server with websocket and cors features.

Inside `schema.resolvers.go:23` DriveWindowChanged subscription resolver I have this 
```
r.subCount = r.subCount + 1
	go func() {
		<-ctx.Done()
		r.Lock()
		r.subCount = r.subCount - 1
		log.Printf("DRIVE UNSUB \nsub Count: %v", r.subCount)
		r.Unlock()
	}()
	log.Printf("DRIVE SUB %v", r.subCount)
```
which is just a subscription observer

## How to reproduce

- Run server with 
```bash 
go run server.go
```

- Run frontend with 

```bash
yarn && yarn start
```

Have an eye on server console, whilst clicking between frontend buttons.
Notice, that clicking on `q331` button somehow duplicates subscription number in server console.
Also clicking between `q111` and `q113`.
But is seems, that `q223` resets this behaviour just fine, so there is that.

`index.js` has a fork between `urql` and `react-apollo`, with identical subscription components, and strangely, `react-apollo` does not resemle this behaviour.

Here is a 19 second video of this
[https://youtu.be/3yjHtEP3xgY](url)
