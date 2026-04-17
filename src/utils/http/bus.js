export default (function () {
  let Event = null;
  let _default = "default";
  Event = (function () {
    let _listen = null;
    let _trigger = null;
    let _remove = null;
    let _shift = Array.prototype.shift;
    let _unshift = Array.prototype.unshift;
    let namespaceCache = {}; // 使用该对象将命名空间缓存起来
    let _create = null;
    // 用户当用户触发是进行事件遍历,而进行对以订阅者进行发布发布
    let each = function (ary, fn) {
      let ret = null;
      for (let i = 0; i < ary.length; i++) {
        let n = ary[i];
        ret = fn.call(n, i, n);
      }
      return ret;
    };
    // 添加监听
    _listen = function (key, fn, cache) {
      if (!cache[key]) cache[key] = [];
      cache[key].push(fn);
    };
    // 触发
    _trigger = function () {
      let cache = _shift.call(arguments);
      let key = _shift.call(arguments);
      let args = arguments;
      let _self = this;
      let stack = cache[key];
      if (!stack || !stack.length) {
        return;
      }
      return each(stack, function () {
        return this.apply(_self, args);
      });
    };
    // 如果已经创建该命名空间则返回该命名空间的发布订阅对象,否则将使用ret创建的新对象
    _create = function (namespace) {
      var namespace = namespace || _default;
      let cache = {};
      let offlineStack = [];
      let ret = {
        listen: function (key, fn, last) {
          if (offlineStack === null) {
            // 如果offlineStack为null，说明命名空间已经初始化，直接添加监听器
            _listen(key, fn, cache);
            return;
          }
          _listen(key, fn, cache);
          if (last === "last") {
            offlineStack.length && offlineStack.pop();
          } else {
            each(offlineStack, function () {
              this();
            });
          }
          // 只有在处理完离线事件后才设置为null，表示该命名空间已经初始化完成
          if (offlineStack.length === 0) {
            offlineStack = null;
          }
        },
        one: function (key, fn, last) {
          _remove(key, cache);
          this.listen(key, fn, last);
        },
        remove: function (key, fn) {
          _remove(key, cache, fn);
        },
        trigger: function () {
          let fn = null;
          let args = arguments;
          let _self = this;
          _unshift.call(arguments, cache);
          args = arguments;
          fn = function () {
            return _trigger.apply(_self, args);
          };
          if (offlineStack) {
            return offlineStack.push(fn);
          }
          return fn();
        }
      };
      // 如果命名空间在缓存中,则使用已经存起来的对象,如果不存在则使用_default的命名空间
      return namespaceCache[namespace] ? namespaceCache[namespace] : (namespaceCache[namespace] = ret);
    };
    return {
      create: _create, // 使用命名空间形式
      one: function (key, fn, last) {
        let event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        let event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        let event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        let event = this.create();
        event.trigger.apply(this, arguments);
      }
    };
  })();
  return Event;
})();
