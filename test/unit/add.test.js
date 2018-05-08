import Vue from 'vue'

describe('$add', () => {
  let vm

  beforeEach(() => {
    vm = new Vue()
  })

  describe('1 + 1', () => {
    it('should be 2', done => {
      nextTick(() => {
        assert(vm.$add(1, 1) === 2, 'You should be implemented!!')
      }).then(done)
    })
  })
})

