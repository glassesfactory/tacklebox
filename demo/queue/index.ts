import {FetchQueue} from "../../src/";

const createLog = (container: Element, text:string) => {
  const li = document.createElement('li');
  li.className = "log";
  li.textContent = text;
  container.appendChild(li);
}

const ready = () => {
  const logArea = document.querySelector('#result-log');
  FetchQueue("http://localhost:3000/demo-api").then((resp)=> {
    createLog(logArea, "resp1 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/100").then((resp)=> {
    createLog(logArea, "resp2 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/1000").then((resp)=> {
    createLog(logArea, "resp3 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/1500").then((resp)=> {
    createLog(logArea, "resp4 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/1550").then((resp)=> {
    createLog(logArea, "resp5 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/2000").then((resp)=> {
    createLog(logArea, "resp6 complete");
  });
  FetchQueue("http://localhost:3000/demo-api/100").then((resp)=> {
    createLog(logArea, "resp7 complete");
  });
}

window.addEventListener('DOMContentLoaded', ready);
