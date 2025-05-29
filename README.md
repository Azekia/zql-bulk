# zql-bulk

Copyright 2022-2025 by AZEKIA Soluciones IT, SL

*Enjoy it under the MIT License (see LICENSE.md)*

Una herramienta básica creada para Node.js que permite realizar importaciones de datos desde SQL Server generando:
 
 - Scripts SQL para crear tablas
 - Scripts SQL para insertar datos con el contenido de las tablas
 - Archivo JSON con el contenido de las tablas

# Installation
En un entorno con Node.js instalado, puedes instalar zql-bulk de forma global utilizando npm:

```bash
git clone https://github.com/azekia/zql-bulk
cd zql-bulk
npm i
npm i -g .
```

Despues podrás usarlo desde el terminal con el comando `zql-bulk`

```bash
C:\Users\antonio\Downloads>zql-bulk

Usage: zql-bulk [options] (or use ZQLBULK_ env vars)



Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --action    Actions to execute (create, inserts...)        [string] [required]
  --server    Server name or IP address                      [string] [required]
  --port      Port number                                               [number]
  --user      User name                                      [string] [required]
  --password  Password                                                  [string]
  --database  Database name                                  [string] [required]
  --table     Table name                                     [string] [required]
  --columns   Column names (can be *)                                   [string]
  --where     Where clause to filter input rows                         [string]
  --totable   Destination Table name                                    [string]

Missing required arguments: action, server, user, database, table
```

### Scripts de creación de tablas


