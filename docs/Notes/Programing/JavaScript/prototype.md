|                          | Dad                | Son                    | Gon                    | dad           | son           | gon           |
| ------------------------ | ------------------ | ---------------------- | ---------------------- | ------------- | ------------- | ------------- |
| typeof obj.\__proto__    | 'function'         | 'function'             | 'function'             | 'object'      | 'object'      | 'object'      |
| typeof obj               | 'function'         | 'function'             | 'function'             | 'object'      | 'object'      | 'object'      |
| typeof obj.prototype     | 'object'           | 'object'               | 'object'               |               |               |               |
| obj.\__proto__           | Function.prototype | Dad                    | Son                    | Dad.prototype | Son.prototype | Gon.prototype |
| obj.prototype            | '{constructor: ƒ}' | 'Dad {constructor: ƒ}' | 'Son {constructor: ƒ}' | undefined     | undefined     | undefined     |
| obj.prototype.\__proto__ | Object.prototype   | Dad.prototype          | Son.prototype          |               |               |               |
|                          |                    |                        |                        |               |               |               |
|                          |                    |                        |                        |               |               |               |

