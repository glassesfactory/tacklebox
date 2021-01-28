import { TackleBox } from "./tacklebox"

export type SignalDict = { [key: string]: AbortController };

const worker: Process[] = [];

// TODO type
const Queue = (url: string, option?: RequestInit, pid?: number) => {
  const ctrl = new AbortController();
  // option が特に指定されてなければ GET で処理する
  if(!option) {
    option = {
      method: "GET"
    };
  }
  option.signal = ctrl.signal;
  // もう少し PID と fork 周りの処理は考える
  pid = pid ? pid : 0;
  if(worker.length < 1) {
    pid = Fork();
  }

  // 格納するのは controller なので ctonrollers では
  worker[pid].signals[url] = ctrl;

  return new Promise((resolve, reject) => {
    const chan: Chan = {
      state: "wait",
      // TODO url encode ?
      key: url,
      job: async chan => {
        // だめだった処理は 渡される job に一任する
        let res;
        try {
          res = await fetch(url, option);
          chan.state = "finish";
          resolve(res);
          cycle();
        } catch (error) {
          chan.state = "failed";
          // TODO: error 整理
          reject(res ? res : error);
          cycle();
        }
        // 通信が完了した AbortController は破棄する
        // ここでいいのだろうか
        delete worker[pid].signals[url];
      },
      args: option
    };
    waitListAdd(chan, pid);
  });
};

type QueueFunc = ReturnType<typeof Queue>;

export const FetchQueue = Queue;

/** タスクを中止する */
export const Abort = (key: string, pid?: number): boolean => {
  pid = pid ? pid : 0;
  const { running, wait, signals } = worker[pid];
  if (!(key in signals)) {
    // なんかエラーだす?
    return false;
  }
  const isRunning = running.find(chan => chan.key === key);

  if (isRunning) {
    isRunning.state = "cancel";
    // 中止を実行
    worker[pid].signals[key].abort();
  } else {
    const isWaitIndex = wait.findIndex(chan => chan.key === key);
    // なんもない
    if (isWaitIndex < 0) {
      return false;
    }
    const isWait = wait[isWaitIndex];
    isWait.state = "cancel";
    // 消す?
    // wait = wait.splice(isWaitIndex, 1);
  }
  // delete signals[key];
  cycle();
  return true
};

// すべて中断
export const AllAbort = () => {
  worker.forEach(p => {
    Object.keys(p.signals).forEach(key => {
      p.signals[key].abort();
    })
  })
}

// worker をすべて消去する
export const Clear = () => {
  AllAbort();
  const len = worker.length;
  for(let i = 0; i < len; i++) {
    worker.pop();
  }
}

// processs を増やす
export const Fork = (): number => {
  if (worker.length >= TackleBox.setting.maxWorkerNum) {
    // error ?
    throw new Error("worker MAX");
  }

  const newProcess = { wait: [], running: [], signals: {}, threshold: TackleBox.setting.threshold };
  // 事前に Fork を呼び出されているパターン
  if(worker.length < 1) {
    worker.push(Object.assign({}, newProcess));
  }
  const pid = worker.push(newProcess) - 1;
  return pid;
};


export type ChanStateType =
  | "wait"
  | "running"
  | "finish"
  | "failed"
  | "cancel"
  | "pendding";


export type Chan = {
  state: ChanStateType;
  key: string;
  job: (chan: Chan) => Promise<unknown>;
  args: unknown;
};


export type Process = {
  wait: Chan[];
  running: Chan[];
  signals: SignalDict;
  threshold: number;
};


export const waitListAdd = (chan: Chan, pid: number) => {
  worker[pid].wait.push(chan);
  exec();
};


export const exec = () => {
  worker.forEach(p => {
    //実行中が規定数に達している
    if (p.running.length >= p.threshold) {
      return;
    }
    const next = p.wait.shift();
    if (!next) {
      return;
    }

    p.running.push(next);
  });
  // もしそれでもしんどくて更に絞りたければこのあたりに sleep() 仕込む
  cycle();
};

const cycle = () => {
  worker.forEach(p => {
    // 稼働中がない
    if (p.running.length < 1) {
      return;
    }
    const removeIndexes: number[] = [];
    p.running.forEach((chan, index) => {
      if (chan.state === "wait") {
        chan.state = "running";
        chan.job(chan);
      }
      if (
        chan.state === "failed" ||
        chan.state === "finish" ||
        chan.state == "cancel"
      ) {
        removeIndexes.push(index);
      }
    });
    p.running = p.running.filter(
      (_, index) => removeIndexes.indexOf(index) < 0
    );
  });

  // 暫定処理
  let hasChannel = false;
  const copyWorker = worker.concat();

  while(!hasChannel && copyWorker.length > 0) {
    const p = copyWorker.pop();

    if(!p) {
      continue;
    }
    if(p.running.length >= p.threshold) {
      break;
    }
    if(p.wait.length > 0) {
      hasChannel = true;
    }
  }

  if(hasChannel) {
    exec();
  }
  /*
  if (p.running.length > 0 && p.running.length < tb.option.threshold) {
    exec();
  }*/
  // 何もなくなった worker は掃除する
};

