This repo includes a fix to the [bouncefix.js](https://github.com/jaridmargolin/bouncefix.js) library to make it work alongside [FastClick](https://github.com/ftlabs/fastclick)

============

## Install


```
npm install bouncefix-fastclick
```

```
bower install bouncefix-fastclick
```

---

## API

Methods should not be called until the DOM is ready.

### bouncefix.add(className);

Apply fix on all elements matching the specified className.

##### PARAMETERS:

* **\*className**: Elements to apply fix to.


##### EXAMPLE USAGE:

```
bouncefix.add('srcollable');
```


### bouncefix.remove(className);

Remove fix from all elements matching the specified className.

##### PARAMETERS:

* **\*className**: Elements to remove fix from.


##### EXAMPLE USAGE:

```
bouncefix.remove('srcollable');
```

---

## TESTS

**Install Dependencies**

```
npm install
```

```
bower install
```

**Run/View**

```
grunt test
```

---

## License

The MIT License (MIT) Copyright (c) 2014 Jarid Margolin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
