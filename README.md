# zn-resource-fake

Fake API for unit testing Zengine backend services that use [zn-resource](https://github.com/rcarraretto/zn-resource) module (unofficial and experimental).

# Install

```sh
$ npm install zn-resource-fake --save-dev
```

# Use

Same interface as zn-resource, except you don't need to inject ZnHttp – all resources will be stored in memory instead of Zengine.

```js
var znRecordService = require('zn-resource-fake')({ resource: 'record' });
var znActivityService = require('zn-resource-fake')({ resource: 'activity' });
```

Make your component receive a zn-resource service as dependency, e.g.:

```js
var MyComponent = function(znRecordService) {

  var doSomething = function() {
  
    var recordData = {
      id: 40,
      formId: 5,
      field123: 'oranges'
    };
  
    return znRecordService.save(recordData);
  };
  
  return {
    doSomething: doSomething
  };
};
```

In production you would use:

```js
var ZnHttp = require('../../lib/zn-http.js');
var znRecordService = require('zn-resource')({ resource: 'record', ZnHttp: ZnHttp });

var component = MyComponent(znRecordService);
```

On test files you would do:

```js
var znRecordService = require('zn-resource-fake')({ resource: 'record' });

var component = MyComponent(znRecordService);

describe('doSomething', function() {

  it("should update field123 to 'oranges'", function() {

    znRecordService.save({
      id: 40,
      formId: 5,
      field123: 'apples'
    });
    
    component.doSomething();
    
    compositeId = {
      id: 40,
      formId: 5
    };
    
    return znRecordService.get(compositeId).then(function(record) {
      expect(record.field123).to.equal('oranges');
    });
  });
});
```
