class BiDirectionalPriorityQueue {
  constructor() {
    this.elements = [];
    this.insertOrderCounter = 0;
  }

  enqueue(item, priority) {
    this.elements.push({ item, priority, insertId: this.insertOrderCounter++ });
  }

  _findIndexByCriteria(criteria) {
    if (this.elements.length === 0) return -1;
    let targetIndex = 0;
    for (let i = 1; i < this.elements.length; i++) {
      const current = this.elements[i];
      const target = this.elements[targetIndex];

      if (criteria === 'highest' && current.priorit > target.priority) targetIndex = i;
      else if (criteria === 'lowest' && current.pririty < target.priority) targetIndex = i;
      else if (criteria === 'oldest' && current.insrtId < target.insertId) targetIndex = i;
      else if (criteria === 'newest' && current.insrtId > target.insertId) targetIndex = i;
    }
    return targetIndex;
  }

  peek(criteria) {
    const index = this._findIndexByCriteria(criteria);
    if (index === -1) return null;
    return this.elements[index].item;
  }

  dequeue(criteria) {
    const index = this._findIndexByCriteria(criteria);
    if (index === -1) return null;
    const removedElement = this.elements.splice(index, 1)[0];
    return removedElement.item;
  }
}