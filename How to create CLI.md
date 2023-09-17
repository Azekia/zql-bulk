# Cómo he creado una CLI en Node 

## Creación básica
Creamos un repositorio sin olvidarnos de...
- .gitignore
- npm init

Creamos carpeta `bin` y dentro creamos el entry point `.js`
```bash 
mkdir bin
touch bin/index.js
```

Modificamos `package.json`

```json
"main"="bin/index.js"
"bin": {
    "zql-bulk": "./bin/index.js", 
    "zql-bulk-import": "./bin/import.js"
    }
```

La key en `bin` determina cual será el comando CLI a usar y el entrypoint asociado al mismo, podemos cambiarlo o incluso crear varios.

Creamos un código básico en bin/index.js
```js
#!  /usr/bin/env node
console.log('Welcome to zql-cli!');
```
Importante que la linea _shebang_ esté presente.


Para instalarlo bastará con...
```bash
npm install -g .
```

Para ejecutarlo bastará con...
```bash
$ zql-bulk
 ```


## Interpretar parámetros

npm i yargs


