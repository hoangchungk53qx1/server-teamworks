
Array.prototype.removeAt = function (index) {
  if (index > -1) {
    this.splice(index, 1)
  }
}

Array.prototype.removeWith = function (item) {
  const index = this.indexOf(item)
  this.removeAt(index)
}

Array.prototype.removeWithId = function (id) {
  console.log(`>>> id = ${id}`)

  const index = this.map(item => item._id).indexOf(id);

  this.removeAt(index)
}


Array.prototype.replaceItemWithId = function (id, newValue) {
  const index = this.map(item => item._id).indexOf(id);

  if (index > -1) {
    this[index] = newValue
  }
}

Array.prototype.replaceItemWithValue = function (newValue) {
  const index = this.map(item => item._id).indexOf(newValue._id);

  if (index > -1) {
    this[index] = newValue
  }
}

module.exports = Array;