import { FetchQueue, Fork } from "../../src";
import { createLog } from "../demo-utils"

const readyHandler = () => {
  const logArea = document.querySelector('#result-log');
  const process2 = Fork();
  console.log(process2);
  FetchQueue("http://localhost:3000/demo-api/1000", {method: "GET"}, 0).then((resp)=> {
    createLog(logArea, "resp1 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/1000", {method: "GET"}, 0 ).then((resp)=> {
    createLog(logArea, "resp2 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/1000", {method: "GET"}, 0).then((resp)=> {
    createLog(logArea, "resp3 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/1000", {method: "GET"}, 0).then((resp)=> {
    createLog(logArea, "resp4 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/1000", {method: "GET"}, 0).then((resp)=> {
    createLog(logArea, "resp5 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/1000", {method: "GET"}, 1).then((resp)=> {
    createLog(logArea, "forked resp6 complete");
  });
}

window.addEventListener('DOMContentLoaded', readyHandler);
