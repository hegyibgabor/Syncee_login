# Syncee Demo App

Ez az alkalmazás egy Angular alapú webes projekt, amely lehetővé teszi a felhasználók számára, hogy profilokat hozzanak létre, bejelentkezzenek, és egy demo Coinbase API-n keresztül megtekintsék a különböző valutákat. A bejelentkezett felhasználók védett útvonalakon keresztül férhetnek hozzá az adatokhoz, és a Google bejelentkezés segítségével három kattintással elérhetik profiljukat.

## Fő funkciók

* Felhasználói regisztráció és bejelentkezés

  * Manuális regisztráció és bejelentkezés email és jelszó alapján
  * Google bejelentkezés (három kattintással)
* Demo valuták megtekintése a Coinbase API alapján

## Környezet futtatása

### Frontend futtatása

A frontend Angular alapú, futtatáshoz navigálj a projekt root könyvtárába, majd:

```bash
ng serve
```

Ez elindítja az alkalmazást a `http://localhost:4200` címen.

### Adatbázis létrehozása MySQL-ben

Hozd létre az `syncee_db` nevű adatbázist a következő SQL parancsokkal:

```sql
CREATE DATABASE syncee_db;
```

Hozd létre a `users` táblát a következő SQL parancsokkal:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    google_id VARCHAR(255) NULL,
    username VARCHAR(255) NULL
);
```

### Backend futtatása (Node.js)

Navigálj a `backend` mappába, majd indítsd el a Node.js szolgáltatást:

```bash
node index.js
```

## Használt technológiák

* Angular
* TypeScript
* MySQL
* Bootstrap
* Különböző Angular könyvtárak a felhasználói élmény fokozásához

## Ismert hibák / hiányosságok

* Google bejelentkezés esetén az első belépéskor a `created_at` mező üres maradhat
* A "Forget Password" funkció jelenleg csak placeholder, nem működik
* Harcode-olt adatbázis és lokális futás, mert nagyon nehéz ingyenes szervereket találni demózás céljából
---

Ha szeretnéd, készíthetek hozzá egy **egyszerű diagramot a rendszer felépítéséről**, ami vizuálisan is mutatja a frontend, backend és adatbázis kapcsolatát. Ez sokszor jól jön a README-ban.

Szeretnéd, hogy csináljam?
