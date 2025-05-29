# zql-bulk

Copyright 2022-2025 by AZEKIA Soluciones IT, SL
https://azekia.com

*Enjoy it under the MIT License (see LICENSE.md)*

Una herramienta básica creada para Node.js que permite realizar importaciones de datos desde SQL Server generando:
 
 - Scripts SQL para crear tablas
 - Scripts SQL para insertar datos con el contenido de las tablas
 - Archivo JSON con el contenido de las tablas

# Installation
En un entorno con Node.js instalado, puedes instalar zql-bulk de forma global utilizando npm:

```
git clone https://github.com/azekia/zql-bulk
cd zql-bulk
npm i -g .
```


Para obtener actualizaciones, simplmente haz un `git pull` en el directorio del proyecto y vuelve a ejecutar `npm i -g .`

```
git pull
npm i -g .
```

Podrás usar la utilidad directamente desde el terminal con el comando `zql-bulk`

```
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



### Scripts para creación de tablas

```
$ zql-bulk --action create --server 192.168.1.5 --user administrador --password 123456 --database BC_LASNIEVES --table Familias

-- CREATE TABLE Familias =================================================
CREATE TABLE [Familias] (
    [tos] INT NULL,
    [familiaCod] NVARCHAR(50) NOT NULL,
    [nombre] NVARCHAR(50) NOT NULL,
    [familiaMadreCod] NVARCHAR(20) NOT NULL,
    [orden] INT NOT NULL
)
```

