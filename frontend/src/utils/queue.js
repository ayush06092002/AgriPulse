let queue = [];

export function enqueueData(record) {
  queue.push(record);
}

export function getQueue() {
  return queue;
}

export function clearQueue() {
  queue = [];
}
