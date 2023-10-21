Разбор решения задачи flatten из [этого видео](https://www.youtube.com/live/ICwDR01RgnA?si=CBdWRZfVGz6r5m8d&t=1186)


## Задача
Написать аналог Array.prototype.flat(Infinity)


### toString
https://www.youtube.com/live/ICwDR01RgnA?si=tsIXD7W2auMaqYvo&t=2151

Мурыч показывает решение основанное на методе `toString` массива. 
https://262.ecma-international.org/14.0/#sec-array.prototype.tostring


```js
var flatten = (
    ( theArr ) => {
        return theArr.toString().split(',');
    }
)
```

Далее Мурыч почему-то перескакивает на 
https://262.ecma-international.org/14.0/#sec-object.prototype.tostring
И говорит что вот тут описан рекурсивный алгоритм. Но это не так.
Cпецификация ведет в Array.prototype.join, в котором и описана рекурсия.
https://262.ecma-international.org/14.0/#sec-array.prototype.join

тоесть, можно просто вызвать `theArr.join().split(',')`


### Рекурсивное решение

https://www.youtube.com/live/ICwDR01RgnA?si=0oUyDaLOR5M8U5c0&t=2331

Мурыч предлагает написать рекурсивное решение.

https://www.youtube.com/live/ICwDR01RgnA?si=qkcVlFMJRH3PoBRD&t=3140
```js
var flatten = (
    ( theArr ) => {
        var theResultArray=[];
        var doIsArray = Array.isArray;

        for (var theValue of theArr) {
            doIsArray(theValue)
                ? (theResultArray = theResultArray.concat(flatten(theValue)))
                : theResultArray.push(theValue);
        }

        return theResultArray;
    }
)
```

https://www.youtube.com/live/ICwDR01RgnA?si=VSlMqipOCNplyTLO&t=3306
Мурыч смотрит байткод

и показывает почему лучше уменьшить количество обращений к проперти

```js
var doIsArray = Array.isArray;
```


https://www.youtube.com/live/ICwDR01RgnA?si=QCGy-WSE8VzE1Ken&t=4199
Мурыч говорит что через строку способ самый оптимальный, но у него есть недостаток
Он все приводит к строке, а это противоречит логике задачи.
Это верное наблюдение, однако мурыч прав что для чисел решение будет работать.
Откуда информация что это самый оптимальный способ - он не сказал.

### Решение от Минина

https://www.youtube.com/live/ICwDR01RgnA?si=sURDPoZGpdAn4tni&t=4446

```js
function flatten(array) {
    const res = [];
    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i])) {
            const flat = flatten(array[i]);
            for (let j = 0; j < flat.length; j++) {
                res.push(flat[i]);
            }
        }
        else {
            res.push(array[i]);
        }
    }
    return res;
}
```

Говорит что решение Минина представляет из себя пример недоразумения
Которое пишется на коленке.

Два вложенных if,
Гонит вложенный цикл
Array.isArray
Говорит что Минин не знает о for of
Тут говорит что раньше forOf был медленный, поэтому на автомате все его используют
https://www.youtube.com/live/ICwDR01RgnA?si=acsfdx7ud8KaTSKS&t=4496

Тут Мурыч уже не сравнивает байткод, а в байткоде для for of как есть дополнительные команды

Говорит что обращение к array[i] медленное.


Тут https://www.youtube.com/live/ICwDR01RgnA?si=_FCKY-XJ3W9wubaS&t=4713 
Мурыч верно говорит про то что, concat быстрее чем пуш в массив.
Называет решение хрюканиной
Тут соведущему смешно про хрюканину https://www.youtube.com/live/ICwDR01RgnA?si=ag9PvH93AqMPKU8g&t=4770


### Генераторы

https://www.youtube.com/live/ICwDR01RgnA?si=ywfD_HwicyQ9Icc6&t=6022

Мурыч показывает это решение

```js
var doFlat = (
    function* ( theArr ) {
        var theValue;
        var doIsArray = Array.isArray;
        for (theValue of theArr) {
            if (doIsArray(theValue)) {
                yield* doFlat(theValue);
            } else {
                yield theValue;
            }
        }
    }
)

var flatten = (
    ( theArr ) => {
        return [...doFlat(theArr)];
    }
)
```

Разбор.
В комментариях под видео я оставил комментарий что разбор слабый.
Попробую объяснить это здесь.

Рекурсивное решение, написанное Мурычем:

```js
var flatten = (
    ( theArr ) => {
        var theResultArray=[];
        var doIsArray = Array.isArray;

        for (var theValue of theArr) {
            doIsArray(theValue)
                ? (theResultArray = theResultArray.concat(flatten(theValue)))
                : theResultArray.push(theValue);
        }

        return theResultArray;
    }
)
```

Рассмотрим пример входного массива вида

```js
[
    [0,[1],2,[3],4,[5],n]
]
```

Cложность рекурсивного решения O(N^2)


Рассмотрим пример входного массива вида

```js
[
    1, 2 , 3, 4, 5, 6, 7, 8, [
    9, 10, 11, 12, [
    13,14, [
    15,
    []
    ]
    ]
    ]
]
```

Во время работы решения Мурыча и Минина создадутся промежуточные массивы

```js
[1, 2, 3, 4, 5, 6, 7, 8] // 1 уровень рекурсии
[9, 10, 11, 12] // 2 уровень рекурсии
[13, 14] // 3 уровень рекурсии
[15] // 4 уровень рекурсии
[] // 5 уровень рекурсии
```

Далее произойдут возвраты из рекурсии, которые приведут к слияниям массивов.

Сложность кокатенации массивов с длинами `M` и `N` O(M + N)

Давайте посчитаем эти операции

```js
[] // 0
[15] // 1 (concat c пустым массивом)
[13, 14] + [15] = [13, 14, 15]  // 3
[9, 10, 11, 12] + [13, 14, 15] = [9, 10, 11, 12, 13, 14, 15] // 7
[1, 2 , 3, 4, 5, 6, 7, 8] + [9, 10, 11, 12, 13, 14, 15] = [1, 2 , 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15] // 15
```

1 + 3 + 7+ 15 = 26 операций. Далее модно заметить что число таких операций будет равно `2**H - 1 - H`, где `H` - глубина  рекурсии.

В нашем примере высота рекурсии для массива с суммарным количеством элементов `N` будет равна `log2(N)+1`

Тогда количество операций для слияния = `2**(log2(N)+1) - 1 - (log2(N)+1) = 2*N - 2 - log2(N)` = `2 * O(N)` = `O(N)`

Что не так плохо.

```js
[
    1,2,3,4,5, [
        1,2,3,4,5, [
            1,2,3,4,5, [

            ]
        ]
    ]
]
```

```js
[1,2,3,4,5] + [] // 5
[1,2,3,4,5] + [1,2,3,4,5], // 10
[1,2,3,4,5] + [1,2,3,4,5,1,2,3,4,5] // 15
```

так же тут видно 2N операций


http://localhost:3000/Big-Oops.js/build#code/%7B%22solutions%22%3A%5B%7B%22id%22%3A%2216972736615520.24072079035909688%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20const%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%20array.length%3B%20i%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20if%20(Array.isArray(array%5Bi%5D))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20const%20flat%20%3D%20flatten(array%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20for%20(let%20j%20%3D%200%3B%20j%20%3C%20flat.length%3B%20j%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(flat%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20res.push(array%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Minin%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972787941150.4328883126931784%22%2C%22code%22%3A%22var%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArg%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20return%20theArg.toString().split('%2C')%3B%5Cn%20%20%20%20%7D%5Cn)%3B%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murich%20toString%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972827227620.06757049809697357%22%2C%22code%22%3A%22var%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArr%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20var%20theResultArray%3D%5B%5D%3B%5Cn%20%20%20%20%20%20%20%20var%20doIsArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20%20%20%20%20for%20(var%20theValue%20of%20theArr)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20doIsArray(theValue)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20(theResultArray%20%3D%20theResultArray.concat(flatten(theValue)))%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20theResultArray.push(theValue)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20return%20theResultArray%3B%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murych%20recursive%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972829947380.239816158729109%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20var%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20var%20isArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20var%20top%20%3D%20new%20NestedIterator(null%2C%20array)%3B%5Cn%5Cn%20%20%20%20while%20(top)%20%7B%5Cn%20%20%20%20%20%20%20%20if%20(top.hasNext())%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20val%20%3D%20top.next()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(isArray(val))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20newTop%20%3D%20new%20NestedIterator(top%2C%20val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20top%20%3D%20newTop%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20top%20%3D%20top.prev%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnclass%20NestedIterator%20%7B%5Cn%20%20%20%20constructor(prev%2C%20list)%20%7B%5Cn%20%20%20%20%20%20%20%20this.index%20%3D%20-1%3B%5Cn%20%20%20%20%20%20%20%20this.list%20%3D%20list%3B%5Cn%20%20%20%20%20%20%20%20this.prev%20%3D%20prev%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20hasNext()%20%7B%5Cn%20%20%20%20%20%20%20%20return%20this.index%20%3C%20this.list.length%20-%201%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20next()%20%7B%5Cn%20%20%20%20%20%20%20%20const%20val%20%3D%20this.list%5B%2B%2Bthis.index%5D%3B%5Cn%20%20%20%20%20%20%20%20return%20val%3B%5Cn%20%20%20%20%7D%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Iterative%20solution%20with%20storing%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972830881210.9959604380084055%22%2C%22code%22%3A%22var%20doFlat%20%3D%20(%5Cn%20%20%20%20function*%20(%20theArr%20)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20theValue%3B%5Cn%20%20%20%20%20%20%20%20var%20doIsArray%20%3D%20Array.isArray%3B%5Cn%20%20%20%20%20%20%20%20for%20(theValue%20of%20theArr)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(doIsArray(theValue))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20yield*%20doFlat(theValue)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20yield%20theValue%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cnvar%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArr%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20return%20%5B...doFlat(theArr)%5D%3B%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murych%20generator%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972836163750.6838868169588834%22%2C%22code%22%3A%22%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20arr.flat(Infinity)%5Cn%7D%22%2C%22title%22%3A%22Array.prototype.flat%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972848260810.17197698256303506%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20var%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20var%20isArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20var%20stack%20%3D%20%5Barray%5BSymbol.iterator%5D()%5D%3B%5Cn%5Cn%20%20%20%20while%20(stack.length)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20top%20%3D%20stack.pop()%5Cn%20%20%20%20%20%20%20%20for%20(var%20val%20of%20top)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(isArray(val))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20stack.push(top)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20stack.push(val%5BSymbol.iterator%5D())%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Array%20iterator%20%2B%20stack%22%2C%22include%22%3Atrue%7D%5D%2C%22testCases%22%3A%5B%7B%22id%22%3A%2216972736647920.06759134529400956%22%2C%22code%22%3A%22%2F%2F%20pass%20test%20data%20into%20solution%5Cn%5Cnreturn%20(solution%2C%20%7B%20arr%20%7D)%20%3D%3E%20solution(arr)%22%2C%22generateDataCode%22%3A%22function%20generateDeepArray(depth)%20%7B%5Cn%20%20%20%20let%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%20depth%3B%20i%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20res%20%3D%20%5Bres%5D%3B%5Cn%20%20%20%20%7D%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(%7Bn%7D)%20%3D%3E%20(%7B%20arr%3A%20generateDeepArray(n)%20%7D)%22%2C%22title%22%3A%22Deep%20Array%2C%20should%20highlight%20problems%20with%20Max%20call%20stack%20size%22%2C%22minInputSize%22%3A1%2C%22maxInputSize%22%3A500000%2C%22stepsCount%22%3A30%7D%5D%7D


Я предложил итеративный вариант

```js
function flatten(array) {
    var res = [];
    var isArray = Array.isArray;

    var top = new NestedIterator(null, array);

    while (top) {
        if (top.hasNext()) {
            var val = top.next();
            if (isArray(val)) {
                var newTop = new NestedIterator(top, val);
                top = newTop;
            } else {
                res.push(val);
            }
        } else {
            top = top.prev;
        }
    }

    return res;
}

class NestedIterator {
    constructor(prev, list) {
        this.index = -1;
        this.list = list;
        this.prev = prev;
    }

    hasNext() {
        return this.index < this.list.length - 1;
    }

    next() {
        const val = this.list[++this.index];
        return val;
    }
}
```

Или с использованием итераторов

```js
function flatten(array) {
    var res = [];
    var isArray = Array.isArray;

    var stack = [array[Symbol.iterator]()];

    while (stack.length) {
        var top = stack.pop()
        for (var val of top) {
            if (isArray(val)) {
                stack.push(top);
                stack.push(val[Symbol.iterator]());
                break
            } else {
                res.push(val);
            }
        }
    }

    return res;
}
```

А можно еще так, рекурсия, без возврата значения,
Работает быстро

```js
var flatten = (
    ( theArr, result) => {
        var doIsArray = Array.isArray;

        for (var theValue of theArr) {
            doIsArray(theValue)
                ? flatten(theValue, result)
                : result.push(theValue);
        }
    }
)
```



Интересные факты

На кейсах с очень глубоким массивом получил max call stack size
На JSON parse, JSON stringify, при отправке в воркер
Нативный arrray.prototype.flat так же имеет проблему с callstak
Lodash рекурсивноый алгоритм + прокилывание ссылки на результат в рекурсию вместо воврата нового массива
https://github.com/lodash/lodash/blob/main/src/.internal/baseFlatten.ts#L25

https://github.com/v8/v8/blob/a709f779401d43fba823085ab001d30339acfe0b/src/builtins/builtins-array-gen.cc#L1542



http://localhost:3000/Big-Oops.js/build#code/%7B%22solutions%22%3A%5B%7B%22id%22%3A%2216972736615520.24072079035909688%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20const%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%20array.length%3B%20i%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20if%20(Array.isArray(array%5Bi%5D))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20const%20flat%20%3D%20flatten(array%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20for%20(let%20j%20%3D%200%3B%20j%20%3C%20flat.length%3B%20j%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(flat%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20res.push(array%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Minin%22%2C%22include%22%3Afalse%7D%2C%7B%22id%22%3A%2216972787941150.4328883126931784%22%2C%22code%22%3A%22var%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArg%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20return%20theArg.toString().split('%2C')%3B%5Cn%20%20%20%20%7D%5Cn)%3B%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murich%20toString%22%2C%22include%22%3Afalse%7D%2C%7B%22id%22%3A%2216972827227620.06757049809697357%22%2C%22code%22%3A%22var%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArr%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20var%20theResultArray%3D%5B%5D%3B%5Cn%20%20%20%20%20%20%20%20var%20doIsArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20%20%20%20%20for%20(var%20theValue%20of%20theArr)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20doIsArray(theValue)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20(theResultArray%20%3D%20theResultArray.concat(flatten(theValue)))%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20theResultArray.push(theValue)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20return%20theResultArray%3B%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murych%20recursive%22%2C%22include%22%3Afalse%7D%2C%7B%22id%22%3A%2216972868725570.13004135662203442%22%2C%22code%22%3A%22var%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArr%2C%20result)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20var%20doIsArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20%20%20%20%20for%20(var%20theValue%20of%20theArr)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20doIsArray(theValue)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20flatten(theValue%2C%20result)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20result.push(theValue)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20var%20result%20%3D%20%5B%5D%3B%5Cn%20%20flatten(arr%2C%20result)%5Cn%5Cn%20%20return%20result%3B%5Cn%7D%22%2C%22title%22%3A%22Recursive%2C%20with%20no%20additional%20memory%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972829947380.239816158729109%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20var%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20var%20isArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20var%20top%20%3D%20new%20NestedIterator(null%2C%20array)%3B%5Cn%5Cn%20%20%20%20while%20(top)%20%7B%5Cn%20%20%20%20%20%20%20%20if%20(top.hasNext())%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20val%20%3D%20top.next()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(isArray(val))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20newTop%20%3D%20new%20NestedIterator(top%2C%20val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20top%20%3D%20newTop%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20top%20%3D%20top.prev%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnclass%20NestedIterator%20%7B%5Cn%20%20%20%20constructor(prev%2C%20list)%20%7B%5Cn%20%20%20%20%20%20%20%20this.index%20%3D%20-1%3B%5Cn%20%20%20%20%20%20%20%20this.list%20%3D%20list%3B%5Cn%20%20%20%20%20%20%20%20this.prev%20%3D%20prev%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20hasNext()%20%7B%5Cn%20%20%20%20%20%20%20%20return%20this.index%20%3C%20this.list.length%20-%201%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20next()%20%7B%5Cn%20%20%20%20%20%20%20%20const%20val%20%3D%20this.list%5B%2B%2Bthis.index%5D%3B%5Cn%20%20%20%20%20%20%20%20return%20val%3B%5Cn%20%20%20%20%7D%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Iterative%20solution%20with%20custom%20iterator%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972830881210.9959604380084055%22%2C%22code%22%3A%22var%20doFlat%20%3D%20(%5Cn%20%20%20%20function*%20(%20theArr%20)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20theValue%3B%5Cn%20%20%20%20%20%20%20%20var%20doIsArray%20%3D%20Array.isArray%3B%5Cn%20%20%20%20%20%20%20%20for%20(theValue%20of%20theArr)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(doIsArray(theValue))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20yield*%20doFlat(theValue)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20yield%20theValue%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cnvar%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArr%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20return%20%5B...doFlat(theArr)%5D%3B%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murych%20generator%22%2C%22include%22%3Afalse%7D%2C%7B%22id%22%3A%2216972836163750.6838868169588834%22%2C%22code%22%3A%22%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20arr.flat(Infinity)%5Cn%7D%22%2C%22title%22%3A%22Array.prototype.flat%22%2C%22include%22%3Afalse%7D%2C%7B%22id%22%3A%2216972848260810.17197698256303506%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20var%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20var%20isArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20var%20stack%20%3D%20%5Barray%5BSymbol.iterator%5D()%5D%3B%5Cn%5Cn%20%20%20%20while%20(stack.length)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20top%20%3D%20stack.pop()%5Cn%20%20%20%20%20%20%20%20for%20(var%20val%20of%20top)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(isArray(val))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20stack.push(top)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20stack.push(val%5BSymbol.iterator%5D())%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Array%20iterator%20%2B%20stack%22%2C%22include%22%3Atrue%7D%5D%2C%22testCases%22%3A%5B%7B%22id%22%3A%2216972736647920.06759134529400956%22%2C%22code%22%3A%22%2F%2F%20pass%20test%20data%20into%20solution%5Cn%5Cnreturn%20(solution%2C%20%7B%20arr%20%7D)%20%3D%3E%20solution(arr)%22%2C%22generateDataCode%22%3A%22function%20generateDeepArray(depth)%20%7B%5Cn%20%20%20%20let%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%20depth%3B%20i%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20res%20%3D%20%5Bres%5D%3B%5Cn%20%20%20%20%7D%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(%7Bn%7D)%20%3D%3E%20(%7B%20arr%3A%20generateDeepArray(n)%20%7D)%22%2C%22title%22%3A%22Deep%20Array%2C%20should%20highlight%20problems%20with%20Max%20call%20stack%20size%22%2C%22minInputSize%22%3A1000%2C%22maxInputSize%22%3A10000%2C%22stepsCount%22%3A10%7D%5D%7D



https://stepancar.github.io/Big-Oops.js/build/#code/%7B%22solutions%22%3A%5B%7B%22id%22%3A%2216972736615520.24072079035909688%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20const%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%20array.length%3B%20i%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20if%20(Array.isArray(array%5Bi%5D))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20const%20flat%20%3D%20flatten(array%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20for%20(let%20j%20%3D%200%3B%20j%20%3C%20flat.length%3B%20j%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(flat%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20res.push(array%5Bi%5D)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Minin%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972787941150.4328883126931784%22%2C%22code%22%3A%22var%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArg%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20return%20theArg.toString().split('%2C')%3B%5Cn%20%20%20%20%7D%5Cn)%3B%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murich%20toString%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972827227620.06757049809697357%22%2C%22code%22%3A%22var%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArr%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20var%20theResultArray%3D%5B%5D%3B%5Cn%20%20%20%20%20%20%20%20var%20doIsArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20%20%20%20%20for%20(var%20theValue%20of%20theArr)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20doIsArray(theValue)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20(theResultArray%20%3D%20theResultArray.concat(flatten(theValue)))%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20theResultArray.push(theValue)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%5Cn%20%20%20%20%20%20%20%20return%20theResultArray%3B%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murych%20recursive%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972868725570.13004135662203442%22%2C%22code%22%3A%22var%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArr%2C%20result)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20var%20doIsArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20%20%20%20%20for%20(var%20theValue%20of%20theArr)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20doIsArray(theValue)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3F%20flatten(theValue%2C%20result)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20result.push(theValue)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20var%20result%20%3D%20%5B%5D%3B%5Cn%20%20flatten(arr%2C%20result)%5Cn%5Cn%20%20return%20result%3B%5Cn%7D%22%2C%22title%22%3A%22Recursive%2C%20with%20no%20additional%20memory%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972829947380.239816158729109%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20var%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20var%20isArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20var%20top%20%3D%20new%20NestedIterator(null%2C%20array)%3B%5Cn%5Cn%20%20%20%20while%20(top)%20%7B%5Cn%20%20%20%20%20%20%20%20if%20(top.hasNext())%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20val%20%3D%20top.next()%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(isArray(val))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20newTop%20%3D%20new%20NestedIterator(top%2C%20val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20top%20%3D%20newTop%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20top%20%3D%20top.prev%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnclass%20NestedIterator%20%7B%5Cn%20%20%20%20constructor(prev%2C%20list)%20%7B%5Cn%20%20%20%20%20%20%20%20this.index%20%3D%20-1%3B%5Cn%20%20%20%20%20%20%20%20this.list%20%3D%20list%3B%5Cn%20%20%20%20%20%20%20%20this.prev%20%3D%20prev%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20hasNext()%20%7B%5Cn%20%20%20%20%20%20%20%20return%20this.index%20%3C%20this.list.length%20-%201%3B%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20next()%20%7B%5Cn%20%20%20%20%20%20%20%20const%20val%20%3D%20this.list%5B%2B%2Bthis.index%5D%3B%5Cn%20%20%20%20%20%20%20%20return%20val%3B%5Cn%20%20%20%20%7D%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Iterative%20solution%20with%20custom%20iterator%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972830881210.9959604380084055%22%2C%22code%22%3A%22var%20doFlat%20%3D%20(%5Cn%20%20%20%20function*%20(%20theArr%20)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20theValue%3B%5Cn%20%20%20%20%20%20%20%20var%20doIsArray%20%3D%20Array.isArray%3B%5Cn%20%20%20%20%20%20%20%20for%20(theValue%20of%20theArr)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(doIsArray(theValue))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20yield*%20doFlat(theValue)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20yield%20theValue%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cnvar%20flatten%20%3D%20(%5Cn%20%20%20%20(%20theArr%20)%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20%20%20return%20%5B...doFlat(theArr)%5D%3B%5Cn%20%20%20%20%7D%5Cn)%5Cn%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Murych%20generator%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972836163750.6838868169588834%22%2C%22code%22%3A%22%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20arr.flat(Infinity)%5Cn%7D%22%2C%22title%22%3A%22Array.prototype.flat%22%2C%22include%22%3Atrue%7D%2C%7B%22id%22%3A%2216972848260810.17197698256303506%22%2C%22code%22%3A%22function%20flatten(array)%20%7B%5Cn%20%20%20%20var%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20var%20isArray%20%3D%20Array.isArray%3B%5Cn%5Cn%20%20%20%20var%20stack%20%3D%20%5Barray%5BSymbol.iterator%5D()%5D%3B%5Cn%5Cn%20%20%20%20while%20(stack.length)%20%7B%5Cn%20%20%20%20%20%20%20%20var%20top%20%3D%20stack.pop()%5Cn%20%20%20%20%20%20%20%20for%20(var%20val%20of%20top)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20if%20(isArray(val))%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20stack.push(top)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20stack.push(val%5BSymbol.iterator%5D())%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20res.push(val)%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(arr)%20%3D%3E%20%7B%5Cn%20%20return%20flatten(arr)%5Cn%7D%22%2C%22title%22%3A%22Array%20iterator%20%2B%20stack%22%2C%22include%22%3Atrue%7D%5D%2C%22testCases%22%3A%5B%7B%22id%22%3A%2216972736647920.06759134529400956%22%2C%22code%22%3A%22%2F%2F%20pass%20test%20data%20into%20solution%5Cn%5Cnreturn%20(solution%2C%20%7B%20arr%20%7D)%20%3D%3E%20solution(arr)%22%2C%22generateDataCode%22%3A%22function%20generateDeepArray(depth)%20%7B%5Cn%20%20%20%20let%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%20depth%3B%20i%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20res%20%3D%20%5Bres%5D%3B%5Cn%20%20%20%20%7D%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(%7Bn%7D)%20%3D%3E%20(%7B%20arr%3A%20generateDeepArray(n)%20%7D)%22%2C%22title%22%3A%22Deep%20Array%2C%20should%20highlight%20problems%20with%20Max%20call%20stack%20size%22%2C%22minInputSize%22%3A1%2C%22maxInputSize%22%3A2000%2C%22stepsCount%22%3A100%7D%2C%7B%22id%22%3A%2216973026832460.18300644596522764%22%2C%22code%22%3A%22%2F%2F%20pass%20test%20data%20into%20solution%5Cn%5Cnreturn%20(solution%2C%20%7B%20arr%20%7D)%20%3D%3E%20solution(arr)%22%2C%22generateDataCode%22%3A%22function%20generateDeepArrayWithNElements(n)%20%7B%5Cn%20%20%20%20const%20elementsOnLevel%20%3D%20500%5Cn%20%20%20%20let%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%2010000000%3B%20i%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20res%20%3D%20%5Bres%5D%3B%5Cn%20%20%20%20%20%20%20%20for%20(let%20j%20%3D%201%3B%20j%20%3C%20elementsOnLevel%3B%20j%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20var%20val%20%3D%20i%20*%20(elementsOnLevel-1)%20%2Bj%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20res.push(val)%5Cn%20%20%20%20%20%20%20%20%20%20%20if%20(val%20%3E%3D%20n)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20res%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%5Cn%20%20%20%20%7D%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(%7Bn%7D)%20%3D%3E%20(%7B%20arr%3A%20generateDeepArrayWithNElements(n)%20%7D)%22%2C%22title%22%3A%22Left%20side%20is%20deep%22%2C%22minInputSize%22%3A10000%2C%22maxInputSize%22%3A100000%2C%22stepsCount%22%3A19%7D%2C%7B%22id%22%3A%2216973061375510.6677520500355401%22%2C%22code%22%3A%22%2F%2F%20pass%20test%20data%20into%20solution%5Cn%5Cnreturn%20(solution%2C%20%7B%20arr%20%7D)%20%3D%3E%20solution(arr)%22%2C%22generateDataCode%22%3A%22function%20generateDeepArrayWithNElements(n)%20%7B%5Cn%20%20%20%20const%20elementsOnLevel%20%3D%20500%5Cn%20%20%20%20let%20res%20%3D%20%5B%5D%3B%5Cn%20%20%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%201000000%3B%20i%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20res%20%3D%20%5Bres%5D%3B%5Cn%20%20%20%20%20%20%20%20for%20(let%20j%20%3D%201%3B%20j%20%3C%20elementsOnLevel%3B%20j%2B%2B)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20var%20val%20%3D%20i%20*%20(elementsOnLevel-1)%20%2Bj%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20res.unshift(val)%5Cn%20%20%20%20%20%20%20%20%20%20%20if%20(val%20%3E%3D%20n)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20res%3B%5Cn%20%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%7D%5Cn%20%20%20%20return%20res%3B%5Cn%7D%5Cn%5Cnreturn%20(%7Bn%7D)%20%3D%3E%20(%7B%20arr%3A%20generateDeepArrayWithNElements(n)%20%7D)%22%2C%22title%22%3A%22Right%20side%20is%20deep%22%2C%22minInputSize%22%3A100000%2C%22maxInputSize%22%3A500000%2C%22stepsCount%22%3A10%7D%5D%7D