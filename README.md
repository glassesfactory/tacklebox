# tacklebox

🎣🧰🚤

JavaScript Simple Fetch Queueing.

🗃

```typescript
const requestInit = {
  method: "POST",
  body: JSON.stringify({ some: "data" })
};
FetchQueue("http://fetch.to.path1", requestInit);
FetchQueue("http://fetch.to.path2", requestInit);
FetchQueue("http://fetch.to.path3", requestInit);
FetchQueue("http://fetch.to.path4", requestInit);
FetchQueue("http://fetch.to.path5", requestInit);
// 1~5どれかの通信が終わったら実行される
FetchQueue("http://fetch.to.path6", requestInit);
```

🚫

```typescript
const requestInit = {
  method: "GET",
};
FetchQueue("http://very.heavy.api", requestInit);
// やめた
Abort("http://very.heavy.api")
```

🍴

```typescript
const pid = Fork();
const requestInit = {
  method: "GET"
};
FetchQueue("http://fetch.to.path1", requestInit);
FetchQueue("http://fetch.to.path2", requestInit);
FetchQueue("http://fetch.to.path3", requestInit);
FetchQueue("http://fetch.to.path4", requestInit);
FetchQueue("http://fetch.to.path5", requestInit);
// 本来は5本だが fork してるので6本目が走れる
FetchQueue("http://fetch.to.path6", requestInit, pid);
```




