class BiDirectionalPriorityQueue {
  constructor() {
    this.elements = [];
    this.insertOrderCounter = 0; 
  }
  enqueue(item, priority) {
    this.elements.push({
      item: item,
      priority: priority,
      insertId: this.insertOrderCounter++
    });
  }
}