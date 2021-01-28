import {FetchQueue, Abort} from "../../src";
import { createLog } from "../demo-utils"


const readyHandler = () => {
  const logArea = document.querySelector('#result-log');

  FetchQueue("http://localhost:3000/demo-api/3000").then((resp)=> {
    createLog(logArea, "resp1 complete");
  }).catch(error => {
    console.log(error);
  });

  const abortResult = Abort("http://localhost:3000/demo-api/3000", 0);
  createLog(logArea, `abort result: ${String(abortResult)}`);
}


window.addEventListener('DOMContentLoaded', readyHandler);
