(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (result) => {
        return result.done ? resolve(result.value) : Promise.resolve(result.value).then(fulfilled, rejected);
      };
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ../src/setting.ts
  var defaultSetting = {
    threshold: 5,
    maxWorkerNum: 3
  };
  var tackleSetting = (override) => {
    return Object.assign({}, defaultSetting, override);
  };

  // ../src/tacklebox.ts
  var TackleBox;
  (function(TackleBox2) {
    TackleBox2.setting = tackleSetting();
  })(TackleBox || (TackleBox = {}));

  // ../src/command.ts
  var worker = [];
  var Queue = (url, option, pid) => {
    const ctrl = new AbortController();
    if (!option) {
      option = {
        method: "GET"
      };
    }
    option.signal = ctrl.signal;
    pid = pid ? pid : 0;
    if (worker.length < 1) {
      pid = Fork();
    }
    worker[pid].signals[url] = ctrl;
    return new Promise((resolve, reject) => {
      const chan = {
        state: "wait",
        key: url,
        job: (chan2) => __async(void 0, null, function* () {
          let res;
          try {
            res = yield fetch(url, option);
            chan2.state = "finish";
            resolve(res);
            cycle();
          } catch (error) {
            chan2.state = "failed";
            console.log(error);
            reject(res ? res : error);
            cycle();
          }
          delete worker[pid].signals[url];
        }),
        args: option
      };
      waitListAdd(chan, pid);
    });
  };
  var FetchQueue = Queue;
  var Fork = () => {
    if (worker.length >= TackleBox.setting.maxWorkerNum) {
      throw new Error("worker MAX");
    }
    const newProcess = {wait: [], running: [], signals: {}, threshold: TackleBox.setting.threshold};
    if (worker.length < 1) {
      worker.push(Object.assign({}, newProcess));
    }
    const pid = worker.push(newProcess) - 1;
    return pid;
  };
  var waitListAdd = (chan, pid) => {
    worker[pid].wait.push(chan);
    exec();
  };
  var exec = () => {
    worker.forEach((p) => {
      if (p.running.length >= p.threshold) {
        return;
      }
      const next = p.wait.shift();
      if (!next) {
        return;
      }
      p.running.push(next);
    });
    cycle();
  };
  var cycle = () => {
    worker.forEach((p) => {
      if (p.running.length < 1) {
        return;
      }
      const removeIndexes = [];
      p.running.forEach((chan, index) => {
        if (chan.state === "wait") {
          chan.state = "running";
          chan.job(chan);
        }
        if (chan.state === "failed" || chan.state === "finish" || chan.state == "cancel") {
          removeIndexes.push(index);
        }
      });
      p.running = p.running.filter((_, index) => removeIndexes.indexOf(index) < 0);
    });
    let hasChannel = false;
    const copyWorker = worker.concat();
    while (!hasChannel && copyWorker.length > 0) {
      const p = copyWorker.pop();
      if (!p) {
        continue;
      }
      if (p.running.length >= p.threshold) {
        break;
      }
      if (p.wait.length > 0) {
        hasChannel = true;
      }
    }
    if (hasChannel) {
      exec();
    }
  };

  // demo-utils/index.ts
  var createLog = (container, text, elName = "li") => {
    const el = document.createElement(elName);
    el.className = "log";
    el.textContent = text;
    container.appendChild(el);
  };

  // queue/index.ts
  var readyHandler = () => {
    const logArea = document.querySelector("#result-log");
    FetchQueue("http://localhost:3000/demo-api").then((resp) => {
      createLog(logArea, "resp1 complete");
    });
    FetchQueue("http://localhost:3000/demo-api/100").then((resp) => {
      createLog(logArea, "resp2 complete");
    });
    FetchQueue("http://localhost:3000/demo-api/1000").then((resp) => {
      createLog(logArea, "resp3 complete");
    });
    FetchQueue("http://localhost:3000/demo-api/1500").then((resp) => {
      createLog(logArea, "resp4 complete");
    });
    FetchQueue("http://localhost:3000/demo-api/1550").then((resp) => {
      createLog(logArea, "resp5 complete");
    });
    FetchQueue("http://localhost:3000/demo-api/2000").then((resp) => {
      createLog(logArea, "resp6 complete");
    });
    FetchQueue("http://localhost:3000/demo-api/100").then((resp) => {
      createLog(logArea, "resp7 complete");
    });
  };
  window.addEventListener("DOMContentLoaded", readyHandler);
})();
